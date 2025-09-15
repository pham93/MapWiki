import { useCallback } from 'react';
import { Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import { easeOut } from 'ol/easing';
import { useExternalServices } from './env-provider';

interface PlaceDetailsResponse {
  location: {
    latitude: number;
    longitude: number;
  };
}

export function useMapNavigation(mapInstance: Map | null) {
  const { googleMapsApiKey } = useExternalServices();

  // Navigate to a place with animation using new Google Places API
  const navigateToPlace = useCallback(
    async (placeId: string) => {
      if (!googleMapsApiKey || !mapInstance) return;

      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places/${placeId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': googleMapsApiKey,
              'X-Goog-FieldMask': 'location',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Place Details API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            url: `https://places.googleapis.com/v1/places/${placeId}`,
            placeId,
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': googleMapsApiKey.substring(0, 10) + '...', // Don't log full API key
              'X-Goog-FieldMask': 'location',
            },
          });
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const data: PlaceDetailsResponse = await response.json();

        if (data.location) {
          const { latitude, longitude } = data.location;

          // Convert to OpenLayers projection and animate to location
          const olCoords = fromLonLat([longitude, latitude]);
          const view = mapInstance.getView();

          // Animate to the new location with smooth transition
          view.animate({
            center: olCoords,
            zoom: 6,
            duration: 1000, // 1 second animation
            easing: easeOut, // Smooth easing function
          });
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    },
    [googleMapsApiKey, mapInstance]
  );

  return {
    navigateToPlace,
  };
}
