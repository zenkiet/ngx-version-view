import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { VersionStrategy } from '../models';

export const VERSION_STRATEGY = new InjectionToken<VersionStrategy>('VERSION_STRATEGY', {
  factory: () => {
    throw new Error('VERSION_STRATEGY must be explicitly provided');
  },
});
export const VERSION_STREAM = new InjectionToken<Observable<string>>('VERSION_STREAM', {
  factory: () => {
    throw new Error('VERSION_STREAM must be explicitly provided');
  },
});
