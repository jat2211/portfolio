import { createContext } from 'react';

export interface RedLightContextValue {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  toggle: () => void;
}

export const RedLightContext = createContext<RedLightContextValue | null>(null);
