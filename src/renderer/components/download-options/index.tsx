import { useCallback } from 'react';
import { Dialog, Pane } from 'evergreen-ui';
import { useDownloadOptions } from '@renderer/jotai/download-options';
import { useDownloads } from '@renderer/jotai/downloads';
import { DownloadOptionsInfo } from '../download-options-info';
import { DownloadOptionsInput } from '../download-options-input';

export function DownloadOptions(): JSX.Element {
  const modal = useDownloadOptions();
  const { downloadAudio, downloadVideo } = useDownloads();

  const startDownload = useCallback(() => {
    if (modal.downloadType === 'audio') {
      downloadAudio(modal.url, {
        ...modal.downloadOptions,
        ...modal.downloadAudioOptions,
      });
    } else {
      downloadVideo(modal.url, {
        ...modal.downloadOptions,
        ...modal.downloadVideoOptions,
      });
    }
    modal.close();
  }, [downloadAudio, downloadVideo, modal]);

  return (
    <Dialog
      isShown={modal.isVisible}
      title="Download"
      isConfirmDisabled={modal.error !== undefined}
      onCloseComplete={modal.close}
      preventBodyScrolling
      onConfirm={startDownload}
      confirmLabel="Download"
      width="90%"
    >
      <Pane display="flex">
        <DownloadOptionsInput />
        <DownloadOptionsInfo />
      </Pane>
    </Dialog>
  );
}
