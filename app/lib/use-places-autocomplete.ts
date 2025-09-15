import React, { useState, useCallback } from 'react';
import { useExternalServices } from './env-provider';

interface AutocompleteSuggestion {
  placePrediction: {
    text: { text: string };
    placeId: string;
  };
}

interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
}

export function usePlacesAutocomplete() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { googleMapsApiKey } = useExternalServices();

  // Debounced search function using new Google Places API
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!googleMapsApiKey || query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);

      try {
        const requestBody = {
          input: query,
        };

        console.debug('Making Places API request:', {
          url: 'https://places.googleapis.com/v1/places:autocomplete',
          body: requestBody,
          apiKeyPrefix: googleMapsApiKey.substring(0, 10) + '...',
        });

        const response = await fetch(
          'https://places.googleapis.com/v1/places:autocomplete',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': googleMapsApiKey,
              'X-Goog-FieldMask': '*',
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Places API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            url: response.url,
            requestBody,
          });
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const data = (await response.json()) as AutocompleteResponse;

        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    },
    [googleMapsApiKey]
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      // Debounce the search
      const timeoutId = setTimeout(() => {
        debouncedSearch(value);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [debouncedSearch]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLoading(false);
  }, []);

  return {
    searchQuery,
    suggestions,
    showSuggestions,
    isLoading,
    handleSearchChange,
    clearSearch,
  };
}
