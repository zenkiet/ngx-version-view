import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface VersionProvider {
  getVersion(): Observable<string>;
}

export const VERSION_PROVIDER = new InjectionToken<VersionProvider>('Version Provider Service', {
  factory: () => {
    throw new Error('VERSION_PROVIDER must be explicitly provided');
  },
});
