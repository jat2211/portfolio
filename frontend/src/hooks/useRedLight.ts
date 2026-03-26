import { useContext } from 'react';
import { RedLightContext } from '../context/redLightContext';

export function useRedLight() {
  const ctx = useContext(RedLightContext);
  if (!ctx) {
    throw new Error('useRedLight must be used within RedLightProvider');
  }
  return ctx;
}
