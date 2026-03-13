import { Map, View } from 'ol';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { apply } from 'ol-mapbox-style';

import { useInteractiveMap } from '~/lib/use-interactive-map';

import VectorTileLayer from 'ol/layer/VectorTile';

import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { getBoundaryStyle, hoverStyle, selectedStyle } from './map-styles';
import { createPortal } from 'react-dom';
import { useGlobalState } from '~/lib/global-state';
import type { FeatureLike } from 'ol/Feature';

const HoverPopover = ({ feature }: { feature: FeatureLike | null }) => {
  if (!feature) {
    return <></>;
  }
  return (
    <div className="grid grid-cols-[auto_auto] gap-y-1 gap-x-8">
      <span className="font-bold text-sm">Name</span>
      <p className="font-bold text-sm">{feature.getProperties().name}</p>
      <p>Code</p>
      <p>{feature.getProperties().code}</p>
      <p>Area</p>
      <p>{feature.getProperties().area} (km)</p>
    </div>
  );
};

const MapView = () => {
  const mapInstance = useRef<Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const boundariesLayerRef = useRef<VectorTileLayer | null>(null);
  const [, setMapLoaded] = useState(false);
  const { selectedFeature } = useGlobalState();
  const { hoverSelection, handleZoomIn, handleZoomOut } = useInteractiveMap(
    mapInstance.current
  );

  // Create map and base layer
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) {
      return;
    }

    const map = new Map({
      target: 'map',
      layers: [],
      view: new View({
        center: [0, 0],
        zoom: 2,
        minZoom: 1,
        maxZoom: 14,
      }),
      controls: [],
      pixelRatio: window.devicePixelRatio || 1,
    });

    const boundariesLayer = new VectorTileLayer({
      properties: {
        id: 'boundaries',
      },
      className: 'boundaries',
      preload: 4,
      source: new VectorTileSource({
        format: new MVT(),
        url: 'https://api.maptiler.com/tiles/countries/{z}/{x}/{y}.pbf?key=TMejMyX3SJD2WPOX9t9M',
      }),
      // This style is optional but helps with visibility
      minZoom: 2,
      maxZoom: 11,
      style: getBoundaryStyle(map),
    });

    boundariesLayerRef.current = boundariesLayer;

    apply(map, 'mapStyle.json').then(() => {
      mapInstance.current = map;
      map.addLayer(boundariesLayer);
      setMapLoaded(true);
    });

    return () => {
      map.setTarget();
      setMapLoaded(false);
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    createPortal(
      <h1>Hello world</h1>,
      document.getElementById('detail-popover')!
    );
  }, [mapRef]);

  useEffect(() => {
    if (!mapInstance.current || !boundariesLayerRef.current) {
      return;
    }
    boundariesLayerRef.current.setStyle(
      getBoundaryStyle(mapInstance.current, (feature) => {
        if (feature.get('code') === hoverSelection?.get('code')) {
          return hoverStyle;
        }
        if (feature.get('code') === selectedFeature?.get('code')) {
          return selectedStyle;
        }
      })
    );
    boundariesLayerRef.current.changed();
  }, [hoverSelection, selectedFeature]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} id="map" className="w-full h-full"></div>
      <div
        id="detail-popover"
        ref={popoverRef}
        className="absolute top-0 left-0 card-background pointer-events-none text-xs translate-x-[5%] -translate-y-[100%] bg-opacity-100 shadow-2xl"
      />
      {popoverRef.current &&
        createPortal(
          <HoverPopover feature={hoverSelection} />,
          popoverRef.current
        )}

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
      </div>
    </div>
  );
};

export default MapView;
