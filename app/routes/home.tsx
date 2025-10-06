import { Suspense, lazy } from 'react';
import { ThemeToggle } from '~/components/ui/theme-toggle';

const MapView = lazy(() => import('~/map-view/map-view'));

export default function Home() {
  return (
    <div className="relative h-screen">
      <Suspense fallback={<div>Loading map...</div>}>
        <MapView />
      </Suspense>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
    </div>
  );
}
