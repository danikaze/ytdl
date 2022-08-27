import { ChangeEvent } from 'react';
import { useSettings } from '@renderer/jotai/settings';

export function useDownloadSettings() {
  const { settings, setSetting } = useSettings();

  function updateDownloadsFolder(paths: readonly string[] | undefined): void {
    if (!paths) return;
    setSetting('downloadFolder', paths[0]);
  }

  function updateTemporalFolder(paths: readonly string[] | undefined): void {
    if (!paths) return;
    setSetting('temporalFolder', paths[0]);
  }

  function updateUseTemporalFolder(ev: ChangeEvent<HTMLInputElement>): void {
    setSetting('useTemporalFolder', ev.target.checked);
  }

  return {
    settings,
    updateDownloadsFolder,
    updateTemporalFolder,
    updateUseTemporalFolder,
  };
}
