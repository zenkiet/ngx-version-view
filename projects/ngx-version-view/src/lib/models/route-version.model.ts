import { Route } from '@angular/router';

export interface RouteVersionConfig {
  version: string;
  data?: Route['data'];
  loadComponent?: Route['loadComponent'];
  loadChildren?: Route['loadChildren'];
  component?: Route['component'];
}
