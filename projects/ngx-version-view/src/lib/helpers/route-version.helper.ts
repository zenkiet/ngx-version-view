import { Route } from '@angular/router';
import { versionRouteResolver } from '../resolvers';
import { RouteVersionConfig } from '../types';

export const createVersionRoute = (config: RouteVersionConfig): Route => ({
  path: config.path,
  loadComponent: () => import('../components').then((m) => m.VersionFeatureComponent),
  resolve: {
    _: versionRouteResolver,
  },
  data: {
    key: config.key,
    components: config.components,
    ...config.data,
  },
});

export const createVersionRoutes = (configs: RouteVersionConfig[]): Route[] =>
  configs.map(createVersionRoute);
