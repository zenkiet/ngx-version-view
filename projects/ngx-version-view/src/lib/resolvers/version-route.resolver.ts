import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ViewService } from '../services';

export const versionRouteResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot) => {
  const viewService = inject(ViewService);
  const components = route.data['components'];
  if (components) {
    viewService.registerFeatures(components);
  }
};
