import { Type } from '@angular/core';
import 'reflect-metadata';
import { VersionFeatureOptions } from '../models/version.model';

export const VERSION_FEATURE_META = Symbol('VERSION_FEATURE');

/**
 * Decorator to mark a component as a version-specific feature
 * @param options Configuration options for version constraints
 */
export function VersionFeature(options: VersionFeatureOptions): ClassDecorator {
  return function (target: any): void {
    Reflect.defineMetadata(
      VERSION_FEATURE_META,
      {
        key: options.key,
        minVersion: options.minVersion,
        maxVersion: options.maxVersion,
      },
      target
    );
  };
}

/**
 * Retrieves version feature metadata from a component
 */
export function getVersionFeatureMeta(target: Type<any>): VersionFeatureOptions | null {
  return Reflect.getMetadata(VERSION_FEATURE_META, target) || null;
}
