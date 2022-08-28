import { atom, useAtom } from 'jotai';
import { Settings } from '@interfaces/settings';

const rawSettings = atom<Settings | undefined>(undefined);

export function useSettings() {
  const [settings, setSettings] = useAtom(rawSettings);

  function updateSetting<T extends keyof Settings>(
    key: T,
    value: Settings[T]
  ): void {
    if (!settings) {
      throw new Error('Need to initialize settings before updating them');
    }

    // send the value to the main process
    window.ytdl.updateSetting(key, value);

    // update the renderer data as well
    setSettings({
      ...settings,
      [key]: value,
    });
  }

  return {
    settings: settings as Readonly<Settings>,
    setSettings,
    updateSetting,
  };
}
