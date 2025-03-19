import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { DateFormat } from '../types';

export type VersionStrategyType = 'semantic' | 'date';

export interface VersionConfig {
  type: VersionStrategyType;
  dateFormat?: DateFormat;
  version: Observable<string>;
}

export interface FeatureConfig {
  key: string;
  minVersion?: string;
  maxVersion?: string;
  component: Type<any>;
}

export interface VersionFeatureOptions {
  key: string;
  minVersion?: string;
  maxVersion?: string;
}

export interface VersionStrategy {
  compare(a: string, b: string): number;
  gte(a: string, b: string): boolean;
  lt(a: string, b: string): boolean;
  clearCache(): void;
}
