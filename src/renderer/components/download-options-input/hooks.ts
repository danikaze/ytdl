import { ChangeEvent, useCallback } from 'react';
import { useDownloadOptions } from '@renderer/jotai/download-options';
import { DownloadType } from '@interfaces/settings';

export function useDownloadOptionsInput() {
  const {
    filename,
    isValidFilename,
    downloadType,
    downloadOptions,
    selectDownloadOutputFile,
    selectDownloadOutputFolder,
    selectDownloadType,
  } = useDownloadOptions();

  const onFileChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      selectDownloadOutputFile(ev.target.value);
    },
    [selectDownloadOutputFile]
  );

  const onFolderChange = useCallback(
    (paths?: readonly string[]) => {
      if (!paths) return;
      selectDownloadOutputFolder(paths[0]);
    },
    [selectDownloadOutputFolder]
  );

  const onTypeChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      selectDownloadType(ev.target.value as DownloadType),
    [selectDownloadType]
  );

  return {
    filename,
    isValidFilename,
    downloadType,
    outputFile: downloadOptions.outputFile,
    outputFolder: downloadOptions.outputFolder,
    onFileChange,
    onFolderChange,
    onTypeChange,
  };
}
