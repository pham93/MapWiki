import { createContext, useContext, useState, type ReactNode } from 'react';
import type { LayerType, VectorLayerType } from '~/map-view/MapView';

interface LayerContextType {
  baseLayer: string;
  setBaseLayer: (layer: string) => void;
  selectedVectorLayer: VectorLayerType;
  setSelectedVectorLayer: (layer: VectorLayerType) => void;
  vectorOpacity: number;
  setVectorOpacity: (opacity: number) => void;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export function LayerProvider({
  children,
  selectedVectorLayer,
  setSelectedVectorLayer,
  vectorOpacity,
  setVectorOpacity,
}: {
  children: ReactNode;
  selectedVectorLayer: VectorLayerType;
  setSelectedVectorLayer: (layer: VectorLayerType) => void;
  vectorOpacity: number;
  setVectorOpacity: (opacity: number) => void;
}) {
  const [baseLayer, setBaseLayer] = useState<string>('osm');
  return (
    <LayerContext.Provider
      value={{
        baseLayer,
        setBaseLayer,
        selectedVectorLayer,
        setSelectedVectorLayer,
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
