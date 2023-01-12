import { useCallback } from 'react';
import { Dialog, Pane } from 'evergreen-ui';
import { useDownloadOptions } from '@renderer/jotai/download-options';
import { DownloadOptionsInfo } from '../download-options-info';
import { DownloadOptionsInput } from '../download-options-input';

export function DownloadOptions(): JSX.Element {
  const modal = useDownloadOptions();

  const startDownload = useCallback(() => {
    if (modal.downloadType === 'audio') {
      window.ytdl.downloadAudio(modal.url, {
        ...modal.downloadOptions,
        ...modal.downloadAudioOptions,
        postProcess: modal.postProcess,
      });
    } else {
      window.ytdl.downloadVideo(modal.url, {
        ...modal.downloadOptions,
        ...modal.downloadVideoOptions,
      });
    }
    modal.close();
  }, [modal]);

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
