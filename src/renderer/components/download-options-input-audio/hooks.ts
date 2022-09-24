import { ChangeEvent, useCallback } from 'react';
import { useDownloadOptions } from '@renderer/jotai/download-options';
import { YoutubeDlAudioFormat } from '@utils/youtube/types';
import { AudioProcessOptions } from '@interfaces/download';

export function useDownloadOptionsInputAudio() {
  const {
    downloadAudioOptions,
    updateDownloadAudioOptions,
    updateDownloadPostProcessOptions,
  } = useDownloadOptions();

  const updateAudioFormat = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const format = ev.target.value as YoutubeDlAudioFormat;
      updateDownloadAudioOptions('format', format);
      if (format !== 'mp3') {
        updateDownloadPostProcessOptions('audio', { metadata: undefined });
      }
    },
    [updateDownloadAudioOptions, updateDownloadPostProcessOptions]
  );

  const updateAudioMetadata = useCallback(
    (metadata: Required<AudioProcessOptions>['metadata']) => {
      updateDownloadPostProcessOptions('audio', { metadata });
    },
    [updateDownloadPostProcessOptions]
  );

  return {
    downloadAudioOptions,
    updateAudioFormat,
    updateAudioMetadata,
  };
}
