import { Route } from '@angular/router';
import { RouteVersionConfig } from '../models';
import { versionRouteGuard } from '../guards';


export const createVersionRoute = (config: RouteVersionConfig, allConfigs: RouteVersionConfig[]): Route => ({
  path: config.version,
  ...(config.component && { component: config.component }),
  ...(config.loadChildren && { loadChildren: config.loadChildren }),
  ...(config.loadComponent && { loadComponent: config.loadComponent }),
  ...(config.data && { data: config.data }),
  canActivate: [versionRouteGuard],
  data: {
    currentRouteVersion: config.version,
    allVersions: allConfigs,
    ...config.data
  }
});

export const createVersionRoutes = (configs: RouteVersionConfig[]): Route[] => {
  return [
    {
      path: '',
      redirectTo: configs[0].version,
      pathMatch: 'full',
    },
    ...configs.map(config => createVersionRoute(config, configs)),
  ];
};