import { ChangeEvent } from 'react';
import { useSettings } from '@renderer/jotai/settings';
import { Settings } from '@interfaces/settings';

export function useDownloadSettings() {
  const { getSetting, updateSetting } = useSettings();

  function updateDownloadsFolder(paths: readonly string[] | false): void {
    if (!paths) return;
    updateSetting('downloads.downloadFolder', paths[0]);
  }

  function updateTemporalFolder(paths: readonly string[] | false): void {
    if (!paths) return;
    updateSetting('downloads.temporalFolder', paths[0]);
  }

  function updateUseTemporalFolder(ev: ChangeEvent<HTMLInputElement>): void {
    updateSetting('downloads.useTemporalFolder', ev.target.checked);
  }

  function updateDownloadType(ev: ChangeEvent<HTMLSelectElement>): void {
    updateSetting(
      'downloads.downloadType',
      ev.target.value as Settings['downloads.downloadType']
    );
  }

  const initialDownloadFolder = getSetting('downloads.downloadFolder', true);
  const useTemporalFolder = getSetting('downloads.useTemporalFolder');
  const initialTemporalFolder = getSetting('downloads.temporalFolder');
  const downloadType = getSetting('downloads.downloadType', false);

  return {
    initialDownloadFolder,
    useTemporalFolder,
    initialTemporalFolder,
    downloadType,
    updateDownloadsFolder,
    updateTemporalFolder,
    updateUseTemporalFolder,
    updateDownloadType,
  };
}
