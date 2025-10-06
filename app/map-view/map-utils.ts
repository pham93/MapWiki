import type { Map } from 'ol';

export enum BoundaryLevel {
  COUNTRY = 0,
  PROVINCE = 1,
  DISTRICT = 2,
  CITY = 3,
  SUB_CITY = 4,
}

export const zoomBoundaries: Record<string, { min: number; max?: number }> = {
  [BoundaryLevel.COUNTRY]: { min: 0 },
  [BoundaryLevel.PROVINCE]: { min: 4 },
  [BoundaryLevel.DISTRICT]: { min: 6, max: 10 },
  [BoundaryLevel.CITY]: { min: 8 },
  [BoundaryLevel.SUB_CITY]: { min: 10 },
};

export function getZoom(map: Map) {
  return Math.round(map.getView().getZoom() ?? 0);
}

export function getBoundaryLevel(zoom: number): BoundaryLevel {
  zoom = Math.round(zoom);
  switch (true) {
    case zoom < 4:
      return BoundaryLevel.COUNTRY;
    case zoom < 6:
      return BoundaryLevel.PROVINCE;
    case zoom < 8:
      return BoundaryLevel.DISTRICT;
    case zoom < 10:
      return BoundaryLevel.CITY;
    default:
      return BoundaryLevel.SUB_CITY;
  }
}
