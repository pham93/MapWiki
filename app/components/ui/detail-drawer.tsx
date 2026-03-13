import { X } from 'lucide-react';
import { Button } from './button';
import { useGlobalState } from '~/lib/global-state';
import { cn } from '~/lib/utils';
import { WikidataMedia } from '~/wikidata/wikipage';

export function DetailDrawer() {
  const { detailDrawerOpen, setGlobalStates, selectedFeature } =
    useGlobalState();

  const wikiId = selectedFeature?.get('wikidata') as string | undefined;

  // Determine if this is a state or country based on properties
  return (
    <div
      className={cn(
        'fixed right-0 top-1/2 transform -translate-y-1/2 w-[40vw] h-auto bg-background border-1 shadow-lg transition-transform duration-300 ease-in-out z-40 rounded-md',

        detailDrawerOpen ? '-translate-x-8' : 'translate-x-full',
        'backdrop-filter backdrop-blur-2xl bg-opacity-100 bg-clip-padding'
      )}
    >
      <div className="border-b h-full flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {selectedFeature?.getProperties().name}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGlobalStates(() => ({ detailDrawerOpen: false }))}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <WikidataMedia wikiId={wikiId ?? ''} />
      </div>
    </div>
  );
}
