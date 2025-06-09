import { InjectionToken, Injector, Provider, runInInjectionContext } from '@angular/core';
import { Observable } from 'rxjs';
import { VersionConfig } from '../models';
import { DateVersionStrategy, SemanticVersionStrategy } from '../strategies';
import { VERSION_STRATEGY, VERSION_STREAM } from '../tokens';
import { getDefaultDateFormat, isValidDateFormat } from '../types';

export interface VersionProvider {
  getVersion(): Observable<string>;
}

export const VERSION_PROVIDER = new InjectionToken<VersionProvider>('VERSION_PROVIDER');

export function provideVersionView(config: VersionConfig): Provider[] {
  const providers: Provider[] = [{ provide: VERSION_STREAM, useValue: config.version }];

  if (config.version) {
    providers.push({ provide: VERSION_PROVIDER, useValue: config.provider });
  } else if (config.versionFactory) {
    providers.push({
      provide: VERSION_STREAM,
      useFactory: (injector: Injector) => {
        return runInInjectionContext(injector, () => config.versionFactory!(injector));
      },
      deps: [Injector],
    });
  } else if (config.provider) {
    providers.push(config.provider);
    providers.push({
      provide: VERSION_STREAM,
      useFactory: (versionProvider: VersionProvider) => versionProvider.getVersion(),
      deps: [VERSION_PROVIDER],
    });
  } else {
    throw new Error('Either version or versionProvider must be provided');
  }

  if (config.type === 'date') {
    let dateFormat = getDefaultDateFormat();

    if (config.dateFormat) {
      if (isValidDateFormat(config.dateFormat)) {
        dateFormat = config.dateFormat;
      } else {
        console.warn(
          `Invalid date format: "${config.dateFormat}". Using default format: "${getDefaultDateFormat()}"`
        );
      }
    } else {
      console.warn(`No date format specified, using default: "${getDefaultDateFormat()}"`);
    }

    providers.push({
      provide: VERSION_STRATEGY,
      useValue: new DateVersionStrategy(dateFormat),
    });
  } else {
    providers.push({
      provide: VERSION_STRATEGY,
      useClass: SemanticVersionStrategy,
    });
  }

  return providers;
}
