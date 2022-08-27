import { useAppScreen } from '@renderer/jotai/app-screen';
import { KeyboardEvent, useMemo } from 'react';

export function SettingsScreen() {
  const { setScreen } = useAppScreen();
  const goBack = useMemo(() => () => setScreen('downloads'), [setScreen]);
  const keyHandler = useMemo(
    () => (ev: KeyboardEvent) => {
      if (ev.key !== 'Enter') return;
      goBack();
    },
    [goBack]
  );

  return (
    <div>
      <div>Settings</div>
      <div role="link" tabIndex={0} onClick={goBack} onKeyDown={keyHandler}>
        Go back
      </div>
    </div>
  );
}
