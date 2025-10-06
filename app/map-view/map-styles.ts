import type { Map } from 'ol';
import type { FeatureLike } from 'ol/Feature';
import { Fill, Stroke, Style } from 'ol/style';
import { getBoundaryLevel, getZoom, zoomBoundaries } from './map-utils';

export const hoverStyle = new Style({
  stroke: new Stroke({
    color: 'white',
    width: 2,
  }),
  fill: new Fill({ color: 'rgba(134, 159, 254, 0.1)' }),
});

export const getBoundaryStyle = (
  map: Map,
  callback?: (f: FeatureLike) => Style | undefined
) => {
  return (feature: FeatureLike) => {
    if (feature.get('layer') === 'postal') {
      return new Style({});
    }
    const zoom = getZoom(map);
    const level = feature.get('level') as number;

    const { min, max } = zoomBoundaries[level];
    const curr = getBoundaryLevel(zoom) === feature.get('level');

    if (zoom < min || (max && zoom >= max)) {
      return new Style({});
    }

    const custom = callback?.(feature);
    if (custom) {
      return custom;
    }

    return new Style({
      stroke: new Stroke({
        color: `rgba(152, 128, 227, ${curr ? '0.5' : '1'})`,
        width: curr ? 0.5 : 1,
      }),
      fill: new Fill({ color: 'transparent' }),
    });
  };
};
