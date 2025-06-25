import { inject } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { VERSION_STRATEGY, VERSION_STREAM } from "../tokens";
import { RouteVersionConfig } from "../models";

export const versionRouteGuard: CanActivateFn | CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
) => {
  const allVersions = route.data?.['allVersions'] as RouteVersionConfig[];
  const currentRouteVersion = route.data?.['currentRouteVersion'] as string;

  if (!allVersions?.length || !currentRouteVersion) return true;


  const currentAppVersion = toSignal(inject(VERSION_STREAM))();
  if (!currentAppVersion) return true;

  const strategy = inject(VERSION_STRATEGY);
  const router = inject(Router);

  const latestVersion = allVersions.filter(version => strategy.compare(currentAppVersion, version.version) >= 0).sort((a, b) => strategy.compare(b.version, a.version))[0];
  if (!latestVersion) return true;

  if (currentRouteVersion === latestVersion.version) return true;

  return navigateToVersion(router, route, latestVersion.version);
};

/**
 * Navigate to the target version with proper URL construction
 */
function navigateToVersion(
  router: Router,
  route: ActivatedRouteSnapshot,
  targetVersion: string
): boolean {
  try {
    // Build the correct navigation path
    const routeSegments = route.pathFromRoot
      .map(r => r.url.map(segment => segment.path))
      .flat()
      .filter(segment => segment);

    // Find the current route version segment index
    const currentVersionIndex = routeSegments.findIndex(segment =>
      route.data?.['allVersions']?.some((v: RouteVersionConfig) => v.version === segment)
    );

    let navigationPath: string[];

    if (currentVersionIndex !== -1) {
      // Replace the version segment
      navigationPath = [...routeSegments];
      navigationPath[currentVersionIndex] = targetVersion;
    } else {
      // Fallback: navigate to target version directly
      navigationPath = [targetVersion];
    }

    // Navigate with replace to avoid history pollution
    router.navigate(navigationPath, {
      replaceUrl: true,
      relativeTo: route.parent as unknown as ActivatedRoute
    });

    return false;

  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback navigation
    router.navigate([targetVersion], { replaceUrl: true });
    return false;
  }
}