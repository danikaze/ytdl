import { ChangeEvent, useCallback } from 'react';
import { useDownloadOptions } from '@renderer/jotai/download-options';
import { YoutubeDlAudioFormat } from '@utils/youtube/types';

export function useDownloadOptionsInputAudio() {
  const { downloadAudioOptions, updateDownloadAudioOptions } =
    useDownloadOptions();

  const updateAudioFormat = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      updateDownloadAudioOptions(
        'format',
        ev.target.value as YoutubeDlAudioFormat
      );
    },
    [updateDownloadAudioOptions]
  );

  return {
    downloadAudioOptions,
    updateAudioFormat,
  };
}
