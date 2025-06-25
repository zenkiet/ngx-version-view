import { Route } from '@angular/router';
import { versionRouteGuard } from '../guards/route-version.guard';
import { RouteVersionConfig } from '../models';

const createVersionRoute = (config: RouteVersionConfig, configs: RouteVersionConfig[]): Route => {
  return {
    path: config.version,
    ...(config.loadComponent ? { loadComponent: config.loadComponent } : {}),
    ...(config.loadChildren ? { loadChildren: config.loadChildren } : {}),
    ...(config.component ? { component: config.component } : {}),
    canActivate: [versionRouteGuard],
    data: {
      currentVersion: config.version,
      configs,
      ...config.data,
    },
  };
};

export const createVersionRoutes = (configs: RouteVersionConfig[]): Route[] => [
  {
    path: '',
    redirectTo: configs[0].version,
    pathMatch: 'full',
  },
  ...configs.map((config) => createVersionRoute(config, configs)),
];
