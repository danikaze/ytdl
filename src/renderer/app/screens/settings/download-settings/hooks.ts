import { ChangeEvent } from 'react';
import { useSettings } from '@renderer/jotai/settings';

export function useDownloadSettings() {
  const { settings, updateSetting } = useSettings();

  function updateDownloadsFolder(paths: readonly string[] | undefined): void {
    if (!paths) return;
    updateSetting('downloadFolder', paths[0]);
  }

  function updateTemporalFolder(paths: readonly string[] | undefined): void {
    if (!paths) return;
    updateSetting('temporalFolder', paths[0]);
  }

  function updateUseTemporalFolder(ev: ChangeEvent<HTMLInputElement>): void {
    updateSetting('useTemporalFolder', ev.target.checked);
  }

  return {
    settings,
    updateDownloadsFolder,
    updateTemporalFolder,
    updateUseTemporalFolder,
  };
}
