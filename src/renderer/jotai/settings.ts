import { atom, useAtom } from 'jotai';
import {
  LastValue,
  LAST_VALUE,
  Settings,
  SettingsWithLastValueKeys,
  SettingsWithoutLastValueKeys,
} from '@interfaces/settings';

const rawSettings = atom<Settings | undefined>(undefined);

export function useSettings() {
  const [settings, setSettings] = useAtom(rawSettings);

  function getSetting<T extends SettingsWithLastValueKeys & keyof Settings>(
    settingName: T,
    returnLastValue: true
  ): Readonly<Exclude<Settings[T], LastValue>>;
  function getSetting<T extends SettingsWithLastValueKeys>(
    settingName: T,
    returnLastValue: false
  ): Readonly<Settings[T]>;
  function getSetting<T extends SettingsWithoutLastValueKeys & keyof Settings>(
    settingName: T
  ): Readonly<Settings[T]>;
  function getSetting<T extends keyof Settings>(
    settingName: T,
    returnLastValue?: boolean
  ): Readonly<Settings[T]> {
    if (!settings) {
      throw new Error('Need to initialize settings before updating them');
    }

    if (returnLastValue) {
      const settingValue = settings[settingName];
      const lastValue = settings[`last.${settingName}` as T];
      return settingValue === LAST_VALUE ? lastValue : settingValue;
    }
    return settings[settingName] as Settings[T];
  }

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
    getSetting,
    setSettings,
    updateSetting,
  };
}
