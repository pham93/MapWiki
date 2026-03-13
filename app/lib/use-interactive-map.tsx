import { Feature, Map, MapBrowserEvent, Overlay } from 'ol';
import type { Geometry } from 'ol/geom';
import { useEffect, useRef, useState } from 'react';
import { useGlobalState } from './global-state';
import { unByKey } from 'ol/Observable';
import type { FeatureLike } from 'ol/Feature';
import { getBoundaryLevel } from '~/map-view/map-utils';
import { getCenter } from 'ol/extent';

export const useInteractiveMap = (map: Map | null) => {
  const { setGlobalStates } = useGlobalState();
  const prevSelected = useRef<FeatureLike | null>(null);
  const [hoverSelection, setHoverSelection] = useState<FeatureLike | null>(
    null
  );

  const handleZoomIn = () => {
    if (map) {
      const view = map.getView();
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        view.setZoom(currentZoom + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const view = map.getView();
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        view.setZoom(currentZoom - 1);
      }
    }
  };

  useEffect(() => {
    if (!map) {
      return;
    }
    const changeViewListener = map.getView().on('change:resolution', () => {
      const zoom = map.getView().getZoom() ?? 0;
      setGlobalStates({
        currentBoundary: getBoundaryLevel(zoom),
      });
    });

    return () => unByKey(changeViewListener);
  }, [map, setGlobalStates]);

  useEffect(() => {
    if (!map) return;

    // Popup overlay
    const overlay = new Overlay({
      element: document.getElementById('detail-popover')!,
      autoPan: false,
    });

    const handleSelections = (event: MapBrowserEvent) => {
      if (event.dragging) {
        return;
      }
      const features = map.getFeaturesAtPixel(event.pixel, {
        layerFilter: (layer) => {
          return layer.get('id') === 'boundaries';
        },
      });

      const selected = features.reduce((acc, val) => {
        if (val.get('level') > acc.get('level')) {
          acc = val;
        }
        return acc;
      }, features[0]);

      if (selected) {
        overlay.setPosition(event.coordinate);
      } else {
        overlay.setPosition(undefined);
      }

      if (prevSelected.current !== selected) {
        setHoverSelection(selected);
        prevSelected.current = selected;
      }
    };

    map.addOverlay(overlay);

    const onHoverEvent = map.on('pointermove', handleSelections);

    const onClickEvent = map.on('click', () => {
      setGlobalStates({
        detailDrawerOpen: true,
        selectedFeature: prevSelected.current as Feature<Geometry>,
      });
      const geo = prevSelected.current?.getGeometry();
      if (!geo) {
        return;
      }
      const [x, y] = getCenter(geo.getExtent());
      const deltaX = 200 * (map.getView().getResolution() ?? 0);
      map.getView().animate({
        center: [x + deltaX, y],
        duration: 500,
      });
    });

    return () => {
      unByKey(onClickEvent);
      unByKey(onHoverEvent);
      map.removeOverlay(overlay);
    };
  }, [map, setGlobalStates]);

  return { hoverSelection, handleZoomIn, handleZoomOut };
};
