import { inject, Injectable, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FeatureConfig } from '../models';
import { VERSION_STRATEGY, VERSION_STREAM } from '../tokens';

@Injectable({ providedIn: 'root' })
export class ViewService {
  private strategy = inject(VERSION_STRATEGY);
  private version = inject(VERSION_STREAM);

  private featureRegistry = new Map<string, FeatureConfig[]>();
  private featureCache = new Map<string, Type<unknown>>();

  readonly currentVersion = toSignal(this.version);

  registerFeature(config: FeatureConfig): void {
    if (!config?.key || !config?.component) {
      console.warn('Invalid feature config provided', config);
      return;
    }

    const features = this.featureRegistry.get(config.key) || [];
    features.push(config);
    this.featureRegistry.set(config.key, features);
    this.featureCache.clear();
  }

  registerFeatures(configs: FeatureConfig[]): void {
    for (const config of configs) {
      this.registerFeature(config);
    }
    this.featureCache.clear();
  }

  /**
   * Get the component to render for a feature key based on current version
   */
  getFeatureComponent<T>(key: string): Type<T> | null {
    if (!key) {
      console.warn('Empty feature key provided');
      return null;
    }

    const currentVersion = this.currentVersion();
    if (!currentVersion) {
      console.warn('No current version available');
      return null;
    }

    // Check cache first to avoid re-computation
    const cacheKey = `${key}:${currentVersion}`;
    if (this.featureCache.has(cacheKey)) {
      return this.featureCache.get(cacheKey) as Type<T> | null;
    }

    const features = this.featureRegistry.get(key) || [];
    if (features.length === 0) return null;

    // Find best match feature for current version
    const result = this.findBestMatch<T>(features, currentVersion);

    // Cache result to avoid re-computation
    if (result !== null) {
      this.featureCache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Find the best matching feature based on version constraints
   */
  private findBestMatch<T>(features: FeatureConfig[], currentVersion: string): Type<T> | null {
    const matchingFeatures = features.filter((f) => {
      const meetsMinVersion = !f.minVersion || this.strategy.gte(currentVersion, f.minVersion);
      const meetsMaxVersion = !f.maxVersion || this.strategy.lt(currentVersion, f.maxVersion);
      return meetsMinVersion && meetsMaxVersion;
    });

    if (matchingFeatures.length === 0) return null;

    // Sort to get the highest minimum version first
    matchingFeatures.sort((a, b) => {
      if (!a.minVersion) return -1;
      if (!b.minVersion) return 1;
      return this.strategy.compare(b.minVersion, a.minVersion);
    });

    return matchingFeatures[0]?.component as Type<T>;
  }

  clearRegistry(): void {
    this.featureRegistry.clear();
    this.featureCache.clear();
    this.strategy.clearCache();
  }
}
