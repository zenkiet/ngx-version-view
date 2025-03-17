import { Type, TypeDecorator } from '@angular/core';
import 'reflect-metadata';
import { VersionFeatureOptions } from '../interfaces';

export const VERSION_FEATURE_META = Symbol('VERSION_FEATURE');

/**
 * Decorator to mark a component as a version-specific feature
 * @param options Configuration options for version constraints
 */
export function VersionFeature(options: VersionFeatureOptions): TypeDecorator {
  return function <T extends Type<any>>(target: T): T {
    Reflect.defineMetadata(
      VERSION_FEATURE_META,
      {
        key: options.key,
        minVersion: options.minVersion,
        maxVersion: options.maxVersion,
      },
      target
    );
    return target;
  };
}

/**
 * Retrieves version feature configuration metadata from a component
 * @param componentType The component type to get metadata from
 * @returns The version feature configuration or null if not found
 */
export function getVersionFeatureConfig<T extends Type<any>>(
  componentType: T
): VersionFeatureOptions | null {
  return Reflect.getMetadata(VERSION_FEATURE_META, componentType) || null;
}
