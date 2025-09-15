import React from 'react';
import { useEnvironment, useApiConfig, useMapConfig } from '~/lib/env-provider';

// Example 1: Using the main useEnvironment hook
export function ApiServiceExample() {
  const { API_BASE_URL, API_TIMEOUT, ENABLE_DEBUG_MODE } = useEnvironment();

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/data`, {
        signal: AbortSignal.timeout(API_TIMEOUT),
      });

      if (ENABLE_DEBUG_MODE) {
        console.log('API Response:', response);
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return (
    <button
      onClick={fetchData}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Fetch Data from {API_BASE_URL}
    </button>
  );
}

// Example 2: Using specific configuration hooks
export function MapInitializerExample() {
  const apiConfig = useApiConfig();
  const mapConfig = useMapConfig();

  React.useEffect(() => {
    // Initialize map with environment configuration
    console.log('Initializing map with config:', {
      api: apiConfig,
      map: mapConfig,
    });

    // Your map initialization code here
    // const map = new Map({
    //   center: mapConfig.defaultCenter,
    //   zoom: mapConfig.defaultZoom,
    //   // ... other options
    // });
  }, [apiConfig, mapConfig]);

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold">Map Configuration</h3>
      <p>Center: {mapConfig.defaultCenter.join(', ')}</p>
      <p>Zoom: {mapConfig.defaultZoom}</p>
      <p>API Timeout: {apiConfig.timeout}ms</p>
    </div>
  );
}

// Example 3: Conditional rendering based on feature flags
export function FeatureFlagExample() {
  const { ENABLE_DEBUG_MODE, ENABLE_ANALYTICS } = useEnvironment();

  return (
    <div className="space-y-2">
      {ENABLE_DEBUG_MODE && (
        <div className="p-2 bg-yellow-100 text-yellow-800 rounded">
          🔧 Debug Mode is Enabled
        </div>
      )}

      {ENABLE_ANALYTICS && (
        <div className="p-2 bg-green-100 text-green-800 rounded">
          📊 Analytics is Enabled
        </div>
      )}

      <div className="p-2 bg-blue-100 text-blue-800 rounded">
        ℹ️ App Environment: {useEnvironment().APP_ENVIRONMENT}
      </div>
    </div>
  );
}
