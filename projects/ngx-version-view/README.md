# NgxVersionView

## 📚 API Reference

### 🧩 Core Components

#### `VersionFeatureComponent`

The primary component for rendering version-aware content.

```typescript
@Component({
  selector: 'ngx-view-component',
  // ...
})
class VersionFeatureComponent {
  @Input({ required: true }) key: string; // 🔑 Feature identifier
  @Input() data: Record<string, any>; // 📊 Data to pass to component
}
```

**Usage:**

```html
<ngx-view-component
  key="featureName"
  [data]="{ prop1: 'value1', prop2: 'value2' }"
>
  <!-- Fallback content -->
</ngx-view-component>
```

### 🛠️ Core Services

#### `ViewService`

Central service for managing version-aware features.

```typescript
class ViewService {
  // 📡 Current application version (readonly signal)
  readonly currentVersion: Signal<string | undefined>;

  // 📝 Register a single feature
  registerFeature(config: FeatureConfig): void;

  // 📝 Register multiple features
  registerFeatures(configs: FeatureConfig[]): void;

  // 🎯 Get component for feature key
  getFeatureComponent<T>(key: string): Type<T> | null;

  // 🧹 Clear all registrations and cache
  clearRegistry(): void;
}
```

### 🎨 Decorators

#### `@VersionFeature`

Decorator for marking components with version metadata.

```typescript
function VersionFeature(options: VersionFeatureOptions): ClassDecorator;

interface VersionFeatureOptions {
  key: string; // 🔑 Unique feature identifier
  minVersion?: string; // 📊 Minimum version (inclusive)
  maxVersion?: string; // 📈 Maximum version (exclusive)
}
```

### 🔧 Configuration Functions

#### `provideVersionView`

Main configuration function for setting up the library.

```typescript
function provideVersionView(config: VersionConfig): Provider[];

interface VersionConfig {
  type: 'semantic' | 'date'; // 📊 Version strategy
  dateFormat?: DateFormat; // 📅 Date format (for date type)
  version?: Observable<string>; // 🔄 Version stream
  versionFactory?: (injector: Injector) => Observable<string>; // 🏭 Version factory
  provider?: Provider; // 🔗 Custom provider
}
```

### 🛤️ Routing Functions

#### `createVersionRoutes`

Creates version-aware route configurations.

```typescript
function createVersionRoutes(configs: RouteVersionConfig[]): Route[];

interface RouteVersionConfig {
  version: string; // 📊 Route version
  data?: Route['data']; // 📋 Route data
  loadComponent?: Route['loadComponent']; // 🔄 Lazy component loader
  loadChildren?: Route['loadChildren']; // 🔄 Lazy children loader
  component?: Route['component']; // 🧩 Direct component
}
```

#### `versionRouteGuard`

Guard that handles automatic version-based route redirection.

```typescript
const versionRouteGuard: CanActivateFn | CanActivateChildFn;
```

### 🎯 Version Strategies

#### `SemanticVersionStrategy`

Handles semantic versioning (1.2.3 format).

```typescript
class SemanticVersionStrategy implements VersionStrategy {
  compare(a: string, b: string): number; // Compare versions
  gte(a: string, b: string): boolean; // Greater than or equal
  lt(a: string, b: string): boolean; // Less than
  clearCache(): void; // Clear comparison cache
}
```

#### `DateVersionStrategy`

Handles date-based versioning with configurable formats.

```typescript
class DateVersionStrategy implements VersionStrategy {
  constructor(dateFormat: DateFormat);
  setDateFormat(format: DateFormat): void;
  compare(a: string, b: string): number;
  gte(a: string, b: string): boolean;
  lt(a: string, b: string): boolean;
  clearCache(): void;
}
```

---
