import { ChangeEvent, useCallback } from 'react';
import { useDownloadOptions } from '@renderer/jotai/download-options';
import { YoutubeDlVideoFormat } from '@utils/youtube/types';

export function useDownloadOptionsInputVideo() {
  const { downloadVideoOptions, updateDownloadVideoOptions } =
    useDownloadOptions();

  const updateVideoFormat = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      updateDownloadVideoOptions(
        'format',
        ev.target.value as YoutubeDlVideoFormat
      );
    },
    [updateDownloadVideoOptions]
  );

  return {
    downloadVideoOptions,
    updateVideoFormat,
  };
}
