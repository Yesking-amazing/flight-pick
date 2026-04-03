import type { TrackedRoute } from '../types/flight';

const TRACKED_KEY = 'flightpick_tracked_routes';

export function getTrackedRoutes(): TrackedRoute[] {
  const stored = localStorage.getItem(TRACKED_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addTrackedRoute(route: Omit<TrackedRoute, 'id' | 'addedAt'>): TrackedRoute {
  const routes = getTrackedRoutes();
  const newRoute: TrackedRoute = {
    ...route,
    id: `tr_${Date.now()}`,
    addedAt: new Date().toISOString(),
  };
  routes.push(newRoute);
  localStorage.setItem(TRACKED_KEY, JSON.stringify(routes));
  return newRoute;
}

export function removeTrackedRoute(id: string): void {
  const routes = getTrackedRoutes().filter(r => r.id !== id);
  localStorage.setItem(TRACKED_KEY, JSON.stringify(routes));
}

export function isRouteTracked(originCode: string, destCode: string): boolean {
  return getTrackedRoutes().some(
    r => r.origin.code === originCode && r.destination.code === destCode
  );
}
