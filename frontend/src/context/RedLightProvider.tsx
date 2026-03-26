import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { RedLightContext } from './redLightContext';

export function RedLightProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('darkroom', enabled);
    return () => {
      document.documentElement.classList.remove('darkroom');
    };
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((v) => !v);
  }, []);

  const value = useMemo(
    () => ({ enabled, setEnabled, toggle }),
    [enabled, toggle],
  );

  return (
    <RedLightContext.Provider value={value}>{children}</RedLightContext.Provider>
  );
}
