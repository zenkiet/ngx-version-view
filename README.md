# NgxVersionView

[![npm version](https://img.shields.io/npm/v/ngx-version-view.svg)](https://www.npmjs.com/package/ngx-version-view)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/zenkiet/ngx-version-view/actions/workflows/release.yml/badge.svg)](https://github.com/zenkiet/ngx-version-view/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

<p align="center">
  <img src="https://raw.githubusercontent.com/zenkiet/ngx-version-view/main/assets/logo.png" alt="NgxVersionView Logo" width="200"/>s
</p>

A powerful Angular library that enables version-aware component rendering for seamless feature toggling based on application versions.

## Features

- 🚀 **Progressive Feature Rollout** - Show different component implementations based on app version
- 🔄 **Dynamic Component Loading** - Seamlessly swap components at runtime
- 🛡️ **Type-safe API** - Fully typed with TypeScript for enhanced developer experience
- 🔌 **Plug and Play** - Simple setup with minimal configuration
- 📦 **Lightweight** - Zero external dependencies
- 💉 **Dependency Injection Ready** - Integrates perfectly with Angular's DI system

## Installation

```bash
npm install ngx-version-view --save
```

## Basic Usage

### 1. Setup Version Provider

First, set up a version provider in your app module or standalone component:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideVersionView } from 'ngx-version-view';
import { BehaviorSubject } from 'rxjs';

// Create a version stream - could be from your API, environment, etc.
const appVersion = new BehaviorSubject<string>('1.0.0');

export const appConfig: ApplicationConfig = {
  providers: [
    // ...other providers
    provideVersionView({
      versionStream: appVersion,
    }),
  ],
};
```

### 2. Create Version-Specific Components

Create components for different versions of a feature and decorate them:

```typescript
// feature-v1.component.ts
import { Component } from '@angular/core';
import { VersionFeature } from 'ngx-version-view';

@Component({
  selector: 'app-feature-v1',
  template: '<div>Basic Feature (v1.0.0)</div>',
})
@VersionFeature({
  key: 'my-feature',
  minVersion: '1.0.0',
  maxVersion: '1.5.0',
})
export class FeatureV1Component {
  @Input() data: any;
}

// feature-v2.component.ts
import { Component } from '@angular/core';
import { VersionFeature } from 'ngx-version-view';

@Component({
  selector: 'app-feature-v2',
  template: '<div>Enhanced Feature (v2.0.0)</div>',
})
@VersionFeature({
  key: 'my-feature',
  minVersion: '2.0.0',
})
export class FeatureV2Component {
  @Input() data: any;
}
```

### 3. Register Feature Components

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { ViewService } from 'ngx-version-view';
import { FeatureV1Component } from './feature-v1.component';
import { FeatureV2Component } from './feature-v2.component';

@Component({...})
export class AppComponent implements OnInit {
  constructor(private viewService: ViewService) {}

  ngOnInit() {
    this.viewService.registerFeatures([
      {
        key: 'my-feature',
        minVersion: '1.0.0',
        maxVersion: '1.5.0',
        feature: FeatureV1Component
      },
      {
        key: 'my-feature',
        minVersion: '2.0.0',
        feature: FeatureV2Component
      }
    ]);
  }
}
```

### 4. Use the Version-Aware Component

```html
<ngx-view-component
  key="my-feature"
  [data]="{ customData: 'Some data to pass' }"
>
  <!-- Fallback content if no matching version is found -->
  <p>This feature is not available in your version</p>
</ngx-view-component>
```

## Advanced Usage

### Custom Version Provider

For more complex scenarios, you can implement a custom version provider:

```typescript
import { Injectable } from '@angular/core';
import { VersionProvider } from 'ngx-version-view';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiVersionProvider implements VersionProvider {
  private versionCache$: Observable<string>;

  constructor(private http: HttpClient) {
    this.versionCache$ = this.http.get<{ version: string }>('/api/app-info').pipe(
      map((response) => response.version),
      shareReplay(1)
    );
  }

  getVersion(): Observable<string> {
    return this.versionCache$;
  }
}

// In your app config
provideVersionView({
  versionProvider: {
    provide: VERSION_PROVIDER,
    useClass: ApiVersionProvider,
  },
});
```

### Checking Feature Availability

You can programmatically check if a feature is available for the current version:

```typescript
import { Component } from '@angular/core';
import { ViewService } from 'ngx-version-view';

@Component({...})
export class FeatureWrapperComponent {
  featureEnabled: boolean;

  constructor(private viewService: ViewService) {
    this.featureEnabled = this.viewService.isFeatureAvailable('my-feature');
  }
}
```

### Getting Current Version

```typescript
import { Component } from '@angular/core';
import { ViewService } from 'ngx-version-view';

@Component({
  selector: 'app-version-display',
  template: '<div>Current version: {{ version() }}</div>',
})
export class VersionDisplayComponent {
  version = this.viewService.currentVersion;

  constructor(private viewService: ViewService) {}
}
```

## API Reference

### Core Components

| Component                 | Description                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| `VersionFeatureComponent` | The main component to dynamically render version-specific components |

### Decorators

| Decorator                  | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `@VersionFeature(options)` | Marks a component as a version-specific implementation |

### Services

| Service       | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `ViewService` | Manages the feature registry and provides version-based component selection |

### Interfaces

| Interface               | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `VersionFeatureOptions` | Configuration for the `@VersionFeature` decorator       |
| `VersionFeatureConfig`  | Configuration for registering features programmatically |
| `VersionProvider`       | Interface for custom version providers                  |
| `VersionViewOptions`    | Options for configuring the library                     |

## Use Cases

- **Progressive Feature Rollout**: Gradually introduce new versions of features
- **A/B Testing**: Serve different implementations to different users
- **Backwards Compatibility**: Maintain support for older application versions
- **Feature Flagging**: Enable/disable features based on app version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For more details, check our [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About the Author

**Kiet Le** - [zenkiet](https://github.com/zenkiet)
