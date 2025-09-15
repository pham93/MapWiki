import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { Button } from './button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { cn } from '~/lib/utils';
import { useLayer } from '~/lib/layer-context';
import { useSidebar } from '~/lib/global-state';

export function Sidebar() {
  const { baseLayer, setBaseLayer } = useLayer();
  const { toggle, isOpen } = useSidebar();
  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50"
        onClick={toggle}
      >
        {isOpen ? (
          <PanelLeftClose className="h-4 w-4" />
        ) : (
          <PanelLeftOpen className="h-4 w-4" />
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-1/2 transform -translate-y-1/2 w-[20vw] h-[75vh] bg-background border-1 shadow-lg transition-transform duration-300 ease-in-out z-40 rounded-md',

          isOpen ? 'translate-x-2' : '-translate-x-full',
          'backdrop-filter backdrop-blur-2xl bg-opacity-100 bg-clip-padding'
        )}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Map Layers</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Base Layer
              </label>
              <Select value={baseLayer} onValueChange={setBaseLayer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a base layer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="osm">OpenStreetMap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
