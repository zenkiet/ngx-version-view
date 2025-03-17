import { inject, Injectable, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { VersionFeatureConfig } from '../interfaces';
import { VERSION_PROVIDER } from '../tokens';

@Injectable({ providedIn: 'root' })
export class ViewService {
  private versionProvider = inject(VERSION_PROVIDER);
  private featureRegistry = new Map<string, VersionFeatureConfig[]>();
  private featureCache = new Map<string, Type<unknown>>();

  readonly currentVersion = toSignal(this.versionProvider.getVersion());

  registerFeature(config: VersionFeatureConfig): void {
    const features = this.featureRegistry.get(config.key) || [];
    features.push(config);
    this.featureRegistry.set(config.key, features);
    this.featureCache.clear();
  }

  registerFeatures(configs: VersionFeatureConfig[]): void {
    if (configs.length === 0) return;

    configs.forEach((config) => {
      const features = this.featureRegistry.get(config.key) || [];
      features.push(config);
      this.featureRegistry.set(config.key, features);
    });

    this.featureCache.clear();
  }

  getApplicableFeature<T>(key: string): Type<T> | null {
    const currentVersion = this.currentVersion();
    if (!currentVersion) return null;

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

  isFeatureAvailable(key: string): boolean {
    return !!this.getApplicableFeature(key);
  }

  private findBestMatch<T>(
    features: VersionFeatureConfig[],
    currentVersion: string
  ): Type<T> | null {
    const matchingFeatures = features.filter((f) => {
      const meetsMinVersion = !f.minVersion || this.isVersionGTE(currentVersion, f.minVersion);
      const meetsMaxVersion = !f.maxVersion || this.isVersionLT(currentVersion, f.maxVersion);
      return meetsMinVersion && meetsMaxVersion;
    });

    if (matchingFeatures.length === 0) return null;

    matchingFeatures.sort((a, b) => {
      if (!a.minVersion) return -1;
      if (!b.minVersion) return 1;
      return this.compareVersions(b.minVersion, a.minVersion);
    });

    return matchingFeatures[0]?.feature as Type<T>;
  }

  // Compare two version strings
  private compareVersions(a: string, b: string): number {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);

    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i] || 0;
      const partB = partsB[i] || 0;
      if (partA !== partB) return partA - partB;
    }

    return 0;
  }

  private isVersionGTE(ver1: string, ver2: string): boolean {
    return this.compareVersions(ver1, ver2) >= 0;
  }

  private isVersionLT(ver1: string, ver2: string): boolean {
    return this.compareVersions(ver1, ver2) < 0;
  }
}
