import { ChangeEvent, useCallback, useRef } from 'react';
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const insertOnFileInput = useCallback(
    (str: string): void => {
      const input = fileInputRef.current;
      if (!input) return;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      if (start === null || end === null) {
        input.value += str;
      } else {
        const pre = input.value.substring(0, start);
        const post = input.value.substring(end);
        input.value = `${pre}${str}${post}`;
      }
      selectDownloadOutputFile(input.value);
    },
    [fileInputRef, selectDownloadOutputFile]
  );

  return {
    fileInputRef,
    filename,
    isValidFilename,
    downloadType,
    outputFile: downloadOptions.outputFile,
    outputFolder: downloadOptions.outputFolder,
    onFileChange,
    onFolderChange,
    onTypeChange,
    insertOnFileInput,
  };
}
