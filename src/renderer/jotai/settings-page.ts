import { atom, useAtom } from 'jotai';

export type SettingsPage = 'app' | 'downloads' | 'metadata';

const rawSettingsPage = atom<SettingsPage>('app');

export function useSettingsPage() {
  const [settingsPage, setSettingsPage] = useAtom(rawSettingsPage);

  return {
    settingsPage,
    setSettingsPage,
  };
}
