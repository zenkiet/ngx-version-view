import { Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { VERSION_PROVIDER, VersionProvider } from '../tokens/ngx-version-view.token';

export interface VersionViewOptions {
  /**
   * Version provider implementation or stream
   */
  versionProvider?: VersionProvider | Provider;
  versionStream?: Observable<string>;
}

/**
 * Creates a simple version provider from an observable string
 */
export function createVersionProvider(versionStream: Observable<string>): VersionProvider {
  return {
    getVersion: () => versionStream,
  };
}

/**
 * Configure the Version View library with a version provider
 */
export function provideVersionView(options: VersionViewOptions): Provider[] {
  if (options.versionStream) {
    return [
      {
        provide: VERSION_PROVIDER,
        useValue: createVersionProvider(options.versionStream),
      },
    ];
  }

  if (options.versionProvider) {
    // If it's already a VersionProvider instance
    if ((options.versionProvider as VersionProvider).getVersion) {
      return [
        {
          provide: VERSION_PROVIDER,
          useValue: options.versionProvider,
        },
      ];
    }

    // Otherwise it's a Provider object
    return [options.versionProvider as Provider];
  }

  throw new Error('Either versionProvider or versionStream must be provided to provideVersionView');
}
