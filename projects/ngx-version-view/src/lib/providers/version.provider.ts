import { Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { VersionConfig } from '../models';
import { DateVersionStrategy, SemanticVersionStrategy } from '../strategies';
import { VERSION_STRATEGY, VERSION_STREAM } from '../tokens';
import { getDefaultDateFormat, isValidDateFormat } from '../types';

export function provideVersionView(config: VersionConfig): Provider[] {
  const providers: Provider[] = [{ provide: VERSION_STREAM, useValue: config.version }];

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

export function provideVersionViewSimple(
  version: Observable<string>,
  useSemanticVersioning = true
): Provider[] {
  return provideVersionView({
    type: useSemanticVersioning ? 'semantic' : 'date',
    dateFormat: useSemanticVersioning ? undefined : getDefaultDateFormat(),
    version,
  });
}
