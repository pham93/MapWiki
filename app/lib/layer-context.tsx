import { createContext, useContext, useState, type ReactNode } from 'react';

interface LayerContextType {
  baseLayer: string;
  setBaseLayer: (layer: string) => void;
  vectorOpacity: number;
  setVectorOpacity: (opacity: number) => void;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export function LayerProvider({
  children,
  vectorOpacity,
  setVectorOpacity,
}: {
  children: ReactNode;
  vectorOpacity: number;
  setVectorOpacity: (opacity: number) => void;
}) {
  const [baseLayer, setBaseLayer] = useState<string>('osm');
  return (
    <LayerContext.Provider
      value={{
        baseLayer,
        setBaseLayer,
        vectorOpacity,
        setVectorOpacity,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
}

export function useLayer() {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error('useLayer must be used within a LayerProvider');
  }
  return context;
}
