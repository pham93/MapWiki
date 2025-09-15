import React from 'react';
import {
  useEnvironment,
  useApiConfig,
  useMapConfig,
  useFeatureFlags,
  useExternalServices,
  useAppInfo,
} from '~/lib/env-provider';

export function EnvironmentDemo() {
  const env = useEnvironment();
  const apiConfig = useApiConfig();
  const mapConfig = useMapConfig();
  const featureFlags = useFeatureFlags();
  const externalServices = useExternalServices();
  const appInfo = useAppInfo();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Environment Configuration Demo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* App Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Application Info
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Name:</strong> {appInfo.name}
            </p>
            <p>
              <strong>Version:</strong> {appInfo.version}
            </p>
            <p>
              <strong>Environment:</strong> {appInfo.environment}
            </p>
          </div>
        </div>

        {/* API Configuration */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            API Configuration
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Base URL:</strong> {apiConfig.baseUrl}
            </p>
            <p>
              <strong>Timeout:</strong> {apiConfig.timeout}ms
            </p>
          </div>
        </div>

        {/* Map Configuration */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Map Configuration
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Default Center:</strong> [{mapConfig.defaultCenter[0]},{' '}
              {mapConfig.defaultCenter[1]}]
            </p>
            <p>
              <strong>Default Zoom:</strong> {mapConfig.defaultZoom}
            </p>
            <p>
              <strong>Zoom Range:</strong> {mapConfig.minZoom} -{' '}
              {mapConfig.maxZoom}
            </p>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Feature Flags
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Debug Mode:</strong>{' '}
              {featureFlags.debugMode ? 'Enabled' : 'Disabled'}
            </p>
            <p>
              <strong>Analytics:</strong>{' '}
              {featureFlags.analytics ? 'Enabled' : 'Disabled'}
            </p>
            <p>
              <strong>Notifications:</strong>{' '}
              {featureFlags.notifications ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>

        {/* External Services */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            External Services
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Google Maps API:</strong>{' '}
              {externalServices.googleMapsApiKey
                ? 'Configured'
                : 'Not configured'}
            </p>
            <p>
              <strong>OpenWeather API:</strong>{' '}
              {externalServices.openWeatherApiKey
                ? 'Configured'
                : 'Not configured'}
            </p>
          </div>
        </div>

        {/* All Environment Variables */}
        <div className="space-y-2 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            All Environment Variables
          </h3>
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Click to expand all environment variables
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
              {JSON.stringify(env, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
