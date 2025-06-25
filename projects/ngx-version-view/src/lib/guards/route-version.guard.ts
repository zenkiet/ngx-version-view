import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { RouteVersionConfig } from '../models';
import { VERSION_STRATEGY, VERSION_STREAM } from '../tokens';

export const versionRouteGuard: CanActivateFn | CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const configs = route.data['configs'] as RouteVersionConfig[];
  const currentRouteVersion = route.data['currentVersion'] as string;

  if (!configs.length || !currentRouteVersion) return true;

  const currentAppVersion = toSignal(inject(VERSION_STREAM))();
  if (!currentAppVersion) return true;

  const strategy = inject(VERSION_STRATEGY);
  const router = inject(Router);

  const latestVersion = configs
    .filter((config) => strategy.compare(currentAppVersion, config.version) >= 0)
    .sort((a, b) => strategy.compare(b.version, a.version))[0];
  if (!latestVersion) return true;

  if (latestVersion.version === currentRouteVersion) return true;

  const path = state.url;
  const versionPath = path.replace(currentRouteVersion, latestVersion.version);

  return router.navigate([versionPath], { queryParamsHandling: 'merge', replaceUrl: true });
};
