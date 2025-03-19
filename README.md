# NgxVersionView

[![npm version](https://img.shields.io/npm/v/ngx-version-view.svg)](https://www.npmjs.com/package/ngx-version-view)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/zenkiet/ngx-version-view/actions/workflows/release.yml/badge.svg)](https://github.com/zenkiet/ngx-version-view/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

<p align="center">
  <img src="https://raw.githubusercontent.com/zenkiet/ngx-version-view/main/assets/logo.png" alt="NgxVersionView Logo" width="200"/>
</p>

A powerful Angular library that enables version-aware component rendering for seamless feature management based on application versions. Perfect for progressive feature rollouts, maintaining backward compatibility, and A/B testing.

## Features

- 🚀 **Version-Aware Components** - Render different components based on your application's version
- 🧠 **Smart Feature Selection** - Automatically selects the most appropriate component for the current version
- ⚙️ **Multiple Version Strategies** - Support for semantic versioning (1.1.0) and date-based versioning
- 🎯 **Declarative API** - Simple decorator-based approach for clear and maintainable code
- 💉 **Dependency Injection Integration** - Fully compatible with Angular's DI system
- 🔄 **Dynamic Component Loading** - Efficiently load and render the right component at runtime
- 🔍 **Transparent Caching** - Optimized performance through internal caching mechanisms
- 📦 **Standalone Component Support** - Fully compatible with Angular's standalone components

## Installation

```bash
npm install ngx-version-view --save
```

## Quick Start

### 1. Set up the Version Provider

First, provide the version management service with your app's version:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideVersionView, VersionStrategyType } from 'ngx-version-view';
import { BehaviorSubject } from 'rxjs';

// Create a version stream - in a real app, this might come from an API
const versionStream = new BehaviorSubject<string>('1.0.0');

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideVersionView({
      type: VersionStrategyType.SEMANTIC, // or VersionStrategyType.DATE
      version: versionStream,
    }),
  ],
};
```

For simpler cases, you can use the shorthand version:

```typescript
provideVersionViewSimple(versionStream, true); // true = use semantic versioning
```

### 2. Create Version-Specific Components

Create components for different versions and decorate them with version metadata:

```typescript
// basic-feature.component.ts
import { Component, Input } from '@angular/core';
import { VersionFeature } from 'ngx-version-view';

@Component({
  selector: 'app-basic-feature',
  standalone: true,
  template: `<div class="basic">Basic Feature UI - v1.0</div>`,
})
@VersionFeature({
  key: 'userDashboard',
  minVersion: '1.0.0',
  maxVersion: '2.0.0',
})
export class BasicFeatureComponent {
  @Input() userId: string = '';
}

// advanced-feature.component.ts
import { Component, Input } from '@angular/core';
import { VersionFeature } from 'ngx-version-view';

@Component({
  selector: 'app-advanced-feature',
  standalone: true,
  template: `<div class="advanced">Advanced Feature UI - v2.0+</div>`,
})
@VersionFeature({
  key: 'userDashboard',
  minVersion: '2.0.0',
})
export class AdvancedFeatureComponent {
  @Input() userId: string = '';
}
```

### 3. Register the Components

Register your version-specific components with the service:

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { ViewService } from 'ngx-version-view';
import { BasicFeatureComponent } from './basic-feature.component';
import { AdvancedFeatureComponent } from './advanced-feature.component';

@Component({
  // ...
})
export class AppComponent implements OnInit {
  constructor(private viewService: ViewService) {}

  ngOnInit() {
    // Register features manually (alternative to using decorators)
    this.viewService.registerFeatures([
      {
        key: 'userDashboard',
        minVersion: '1.0.0',
        maxVersion: '2.0.0',
        component: BasicFeatureComponent,
      },
      {
        key: 'userDashboard',
        minVersion: '2.0.0',
        component: AdvancedFeatureComponent,
      },
    ]);
  }
}
```

### 4. Use the Component in Templates

```html
<ngx-view-component
  key="userDashboard"
  [data]="{ userId: currentUser.id }"
>
  <!-- Fallback content if no matching version is found -->
  <p>This feature is not available in your current version</p>
</ngx-view-component>
```

## Advanced Usage

### Date-Based Versioning

For applications that use dates as version numbers:

```typescript
import { provideVersionView, VersionStrategyType, DateFormat } from 'ngx-version-view';
import { BehaviorSubject } from 'rxjs';

const versionStream = new BehaviorSubject<string>('2023-10-15');

provideVersionView({
  type: VersionStrategyType.DATE,
  dateFormat: DateFormat.YYYY_MM_DD_DASH, // Or other supported formats
  version: versionStream,
});
```

### Available Date Formats

The library supports multiple date formats:

```typescript
export enum DateFormat {
  DD_MM_YYYY_DOT = 'dd.MM.yyyy', // 15.10.2023
  MM_DD_YYYY_DOT = 'MM.dd.yyyy', // 10.15.2023
  YYYY_MM_DD_DOT = 'yyyy.MM.dd', // 2023.10.15
  YYYY_MM_DD_DASH = 'yyyy-MM-dd', // 2023-10-15
  MM_DD_YYYY_DASH = 'MM-dd-yyyy', // 10-15-2023
  DD_MM_YYYY_DASH = 'dd-MM-yyyy', // 15-10-2023
}
```

### Programmatic Feature Selection

You can also get components programmatically:

```typescript
import { Component, OnInit } from '@angular/core';
import { ViewService } from 'ngx-version-view';

@Component({
  selector: 'app-dynamic-wrapper',
  template: `
    <ng-container *ngComponentOutlet="featureComponent; inputs: inputData"></ng-container>
  `,
})
export class DynamicWrapperComponent implements OnInit {
  featureComponent: any;
  inputData = { userId: 'user-123' };

  constructor(private viewService: ViewService) {}

  ngOnInit() {
    this.featureComponent = this.viewService.getFeatureComponent('userDashboard');
  }
}
```

### Current Version Access

Access the current application version anywhere in your app:

```typescript
import { Component } from '@angular/core';
import { ViewService } from 'ngx-version-view';

@Component({
  selector: 'app-version-display',
  template: `<div>Running on version: {{ currentVersion() }}</div>`,
})
export class VersionDisplayComponent {
  currentVersion = this.viewService.currentVersion;

  constructor(private viewService: ViewService) {}
}
```

### Dynamic Version Updates

You can dynamically update the application version:

```typescript
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  // ...
})
export class AdminComponent {
  constructor(@Inject(VERSION_STREAM) private versionStream: BehaviorSubject<string>) {}

  updateAppVersion(newVersion: string) {
    this.versionStream.next(newVersion);
    // All version-aware components will automatically update
  }
}
```

## API Reference

### Core Components

| Component                 | Description                                                            |
| ------------------------- | ---------------------------------------------------------------------- |
| `VersionFeatureComponent` | The component that renders version-appropriate UI based on feature key |

### Services

| Service       | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `ViewService` | Core service for registering and retrieving version-based components |

### Decorators

| Decorator           | Description                             |
| ------------------- | --------------------------------------- |
| `@VersionFeature()` | Marks a component with version metadata |

### Configuration

| Function                     | Description                              |
| ---------------------------- | ---------------------------------------- |
| `provideVersionView()`       | Configures the library with full options |
| `provideVersionViewSimple()` | Simplified configuration function        |

### Models and Interfaces

| Interface               | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| `VersionConfig`         | Configuration options for version strategies                    |
| `FeatureConfig`         | Configuration for a version-specific feature                    |
| `VersionFeatureOptions` | Options for the `@VersionFeature` decorator                     |
| `VersionStrategy`       | Interface for implementing custom version comparison strategies |

### Version Strategies

| Strategy                  | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `SemanticVersionStrategy` | Handles semantic versioning (e.g., 1.2.3)               |
| `DateVersionStrategy`     | Handles date-based versioning with configurable formats |

## Examples

### Progressive Feature Rollout

```typescript
@VersionFeature({
  key: 'paymentMethod',
  minVersion: '1.0.0',
  maxVersion: '1.5.0',
})
export class BasicPaymentComponent {}

@VersionFeature({
  key: 'paymentMethod',
  minVersion: '1.5.0',
  maxVersion: '2.0.0',
})
export class EnhancedPaymentComponent {}

@VersionFeature({
  key: 'paymentMethod',
  minVersion: '2.0.0',
})
export class AdvancedPaymentComponent {}
```

### Feature Flags

```typescript
// Enable a feature only in specific versions
@VersionFeature({
  key: 'experimentalFeature',
  minVersion: '1.5.0',
  maxVersion: '1.6.0', // Only available in this version range as a test
})
export class ExperimentalFeatureComponent {}
```

### A/B Testing

```typescript
// Variant A (for 50% of version 2.x users)
@VersionFeature({
  key: 'checkoutFlow',
  minVersion: '2.0.0',
  maxVersion: '3.0.0',
})
export class CheckoutVariantAComponent {}

// Variant B (for 50% of version 2.x users)
@VersionFeature({
  key: 'checkoutFlow',
  minVersion: '2.0.0',
  maxVersion: '3.0.0',
})
export class CheckoutVariantBComponent {}

// In your service that manages which variant to show
constructor(private viewService: ViewService) {
  const variant = Math.random() > 0.5 ? CheckoutVariantAComponent : CheckoutVariantBComponent;

  this.viewService.registerFeature({
    key: 'checkoutFlow',
    minVersion: '2.0.0',
    maxVersion: '3.0.0',
    component: variant
  });
}
```

## Best Practices

1. **Organize by Feature Keys**: Use consistent feature keys across your application
2. **Version Boundaries**: Define clear min/max version boundaries
3. **Fallback Content**: Always provide fallback content in the `ngx-view-component`
4. **Testing**: Test each version-specific component independently
5. **Documentation**: Document version compatibility for each feature

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About the Author

**Kiet Le** - [zenkiet](https://github.com/zenkiet)
