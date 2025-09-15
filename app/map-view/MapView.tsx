import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style';
import { useEffect, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useExternalServices } from '~/lib/env-provider';
import { apply } from 'ol-mapbox-style';

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
  const { googleMapsApiKey } = useExternalServices();

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

  // Manage vector layer
  // useEffect(() => {
  //   if (!mapInstance.current) return;

  //   const map = mapInstance.current;

  //   // Remove existing vector layer
  //   if (vectorLayerRef.current) {
  //     map.removeLayer(vectorLayerRef.current);
  //     vectorLayerRef.current = null;
  //   }

  //   // Add new vector layer if selected
  //   if (selectedVectorLayer !== 'none') {
  //     const vectorLayerOption = vectorLayerOptions.find(
  //       (layer) => layer.id === selectedVectorLayer
  //     );
  //     if (
  //       vectorLayerOption &&
  //       vectorLayerOption.source &&
  //       vectorLayerOption.style
  //     ) {
  //       const vectorLayer = new VectorLayer({
  //         source: vectorLayerOption.source,
  //         style: vectorLayerOption.style,
  //       });
  //       map.addLayer(vectorLayer);
  //       vectorLayerRef.current = vectorLayer;
  //     }
  //   }
  // }, [selectedVectorLayer]);

  // Add zoom change listener for automatic layer switching

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

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} id="map" className="w-full h-full"></div>

      {/* Custom Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
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
  );
};

export default MapView;
