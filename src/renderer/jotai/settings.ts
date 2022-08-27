import { atom, useAtom } from 'jotai';
import { Settings } from '@interfaces/settings';

const rawSettings = atom<Settings>({
  youtubeDlVersion: '2021.12.17',
  downloadFolder: './downloads',
  useTemporalFolder: false,
  temporalFolder: './temp',
});

export function useSettings() {
  const [settings, setSettings] = useAtom(rawSettings);

  function updateSettings(newSettings: Partial<Settings>): void {
    setSettings({
      ...settings,
      ...newSettings,
    });
  }

  return {
    settings: settings as Readonly<Settings>,
    updateSettings,
  };
}
