import { Type } from '@angular/core';

export interface VersionFeatureConfig<T = unknown> {
  key: string;
  minVersion?: string;
  maxVersion?: string;
  feature: Type<T>;
}
