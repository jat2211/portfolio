import { useRedLight } from '../hooks/useRedLight';
import { useDarkroomTick } from '../hooks/useDarkroomTick';
import { DarkroomGrain } from './DarkroomGrain';

/** Timer ticks + grain overlay while safelight is active. */
export function DarkroomEffects() {
  const { enabled } = useRedLight();
  useDarkroomTick(enabled);
  return <DarkroomGrain active={enabled} />;
}
