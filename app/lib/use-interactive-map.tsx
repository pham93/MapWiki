import { Feature, Map, MapBrowserEvent, Overlay } from 'ol';
import type { Geometry } from 'ol/geom';
import { useEffect, useRef, useState } from 'react';
import { useGlobalState } from './global-state';
import { unByKey } from 'ol/Observable';
import type { FeatureLike } from 'ol/Feature';
import { getBoundaryLevel, getZoom } from '~/map-view/map-utils';

export const useInteractiveMap = (map: Map | null) => {
  const { setGlobalStates } = useGlobalState();
  const prevSelected = useRef<FeatureLike | null>(null);
  const [hoverSelection, setHoverSelection] = useState<string | undefined>('');

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
      autoPan: { animation: { duration: 250 } },
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
        if (selected) {
          setHoverSelection(selected.get('code').toString());
          if (overlay.getElement()) {
            overlay.getElement()!.innerHTML = `<>${selected.getProperties().name}</h1>`;
          }
        } else {
          setHoverSelection('');
        }

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
    });

    return () => {
      unByKey(onClickEvent);
      unByKey(onHoverEvent);
      map.removeOverlay(overlay);
    };
  }, [map, setGlobalStates]);

  return { hoverSelection, handleZoomIn, handleZoomOut };
};
