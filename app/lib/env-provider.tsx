import React, { createContext, useContext, type ReactNode } from 'react';

// Environment variables interface
export interface EnvironmentVariables {
  // External Services
  GOOGLE_MAPS_API_KEY?: string;
  MAPTILER_API_KEY?: string;
  OPENWEATHER_API_KEY?: string;
  // Application Settings
  APP_NAME: string;
  APP_VERSION: string;
  APP_ENVIRONMENT: string;
}

// Parse environment variable with type conversion
function parseEnvValue<T>(value: string | undefined, defaultValue: T): T {
  if (value === undefined) return defaultValue;

  // Handle boolean values
  if (typeof defaultValue === 'boolean') {
    return (value.toLowerCase() === 'true') as T;
  }

  // Handle number values
  if (typeof defaultValue === 'number') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : (parsed as T);
  }

  // Handle string values
  return value as T;
}

// Load environment variables with defaults
function loadEnvironmentVariables(): EnvironmentVariables {
  return {
    // API Configuration

    // External Services
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    MAPTILER_API_KEY: import.meta.env.VITE_MAPTILER_API_KEY,
    OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,

    // Application Settings
    APP_NAME: parseEnvValue(import.meta.env.VITE_APP_NAME, 'Map Visual'),
    APP_VERSION: parseEnvValue(import.meta.env.VITE_APP_VERSION, '1.0.0'),
    APP_ENVIRONMENT: parseEnvValue(
      import.meta.env.VITE_APP_ENVIRONMENT,
      'development'
    ),
  };
}

// Create context
const EnvironmentContext = createContext<EnvironmentVariables | undefined>(
  undefined
);

// Provider component
export interface EnvironmentProviderProps {
  children: ReactNode;
  overrideEnv?: Partial<EnvironmentVariables>;
}

export function EnvironmentProvider({
  children,
  overrideEnv,
}: EnvironmentProviderProps) {
  const env = React.useMemo(() => {
    const defaultEnv = loadEnvironmentVariables();
    return overrideEnv ? { ...defaultEnv, ...overrideEnv } : defaultEnv;
  }, [overrideEnv]);

  return (
    <EnvironmentContext.Provider value={env}>
      {children}
    </EnvironmentContext.Provider>
  );
}

// Hook to access environment variables
export function useEnvironment(): EnvironmentVariables {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error(
      'useEnvironment must be used within an EnvironmentProvider'
    );
  }
  return context;
}

export function useExternalServices() {
  const env = useEnvironment();
  return {
    googleMapsApiKey: env.GOOGLE_MAPS_API_KEY,
    openWeatherApiKey: env.OPENWEATHER_API_KEY,
    mapTilerApiKey: env.MAPTILER_API_KEY,
  };
}
