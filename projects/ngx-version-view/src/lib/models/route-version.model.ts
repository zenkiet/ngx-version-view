import { Route } from "@angular/router";

export interface RouteVersionConfig {
  version: string;
  component?: Route['component'];
  loadChildren?: Route['loadChildren'];
  loadComponent?: Route['loadComponent'];
  data?: Route['data'];
}