import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style';
import React, { useEffect, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { ZoomIn, ZoomOut, Search } from 'lucide-react';
import { useExternalServices } from '~/lib/env-provider';
import { apply } from 'ol-mapbox-style';

import { usePlacesAutocomplete } from '~/lib/use-places-autocomplete';
import { useMapNavigation } from '~/lib/use-map-navigation';

export type LayerType = 'osm';
export type VectorLayerType = 'none' | 'countries' | 'states' | 'counties';

export interface LayerOption {
  id: LayerType;
  name: string;
  source: OSM | XYZ;
}

export interface VectorLayerOption {
  id: VectorLayerType;
  name: string;
  source?: VectorSource;
  style?: Style;
}

export const layerOptions: LayerOption[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    source: new OSM(),
  },
];

const MapView = () => {
  const mapInstance = useRef<Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const { googleMapsApiKey } = useExternalServices();

  // Use custom hooks for search functionality
  const {
    searchQuery,
    suggestions,
    showSuggestions,
    handleSearchChange,
    clearSearch,
  } = usePlacesAutocomplete();
  const { navigateToPlace } = useMapNavigation(mapInstance.current);

  // Create map and base layer
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) {
      return;
    }

    const aqLayer = new TileLayer({
      source: new XYZ({
        url: `https://airquality.googleapis.com/v1/mapTypes/US_AQI/heatmapTiles/{z}/{x}/{y}?key=${googleMapsApiKey}`,
      }),
      opacity: 0.5,
      zIndex: 100,
    });

    const map = new Map({
      target: 'map',
      layers: [aqLayer],
      view: new View({
        center: [0, 0],
        zoom: 2,
        minZoom: 1,
        maxZoom: 14,
      }),
      controls: [],
      pixelRatio: window.devicePixelRatio || 1,
    });

    apply(map, 'mapStyle.json');

    mapInstance.current = map;

    return () => {
      map.setTarget();
      mapInstance.current = null;
    };
  }, [googleMapsApiKey]);

  const handleZoomIn = () => {
    if (mapInstance.current) {
      const view = mapInstance.current.getView();
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        view.setZoom(currentZoom + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (mapInstance.current) {
      const view = mapInstance.current.getView();
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        view.setZoom(currentZoom - 1);
      }
    }
  };

  // Handle place selection with navigation
  const handlePlaceSelect = (placeId: string) => {
    navigateToPlace(placeId);
    clearSearch();
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} id="map" className="w-full h-full"></div>

      {/* Custom Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {/* Zoom Controls */}
        <div className="flex flex-col gap-1">
          <Button
            size="icon"
            onClick={handleZoomIn}
            className="h-10 w-10"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="h-10 w-10"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              ref={autocompleteRef}
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-64 pl-10 pr-4 h-10"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.placePrediction.placeId}
                  onClick={() =>
                    handlePlaceSelect(suggestion.placePrediction.placeId)
                  }
                  className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                >
                  {suggestion.placePrediction.text.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
