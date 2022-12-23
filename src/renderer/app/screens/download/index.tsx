import { Pane } from 'evergreen-ui';
import { DownloadList } from '@renderer/components/download-list';
import { YoutubeInput } from '@renderer/components/yt-input';
import { useDownloads } from '@renderer/jotai/downloads';
import { useDownloadOptions } from '@renderer/jotai/download-options';
import { DownloadOptions } from '@renderer/components/download-options';
import { ConfirmationDownloadRemovalDialog } from '@renderer/components/confirmation-download-removal-dialog';

export function DownloadScreen() {
  const { open: openOptionsModal } = useDownloadOptions();
  const { downloadList } = useDownloads();

  return (
    <Pane>
      <YoutubeInput onInput={openOptionsModal} />
      <DownloadList downloads={downloadList} />
      <DownloadOptions />
      <ConfirmationDownloadRemovalDialog />
    </Pane>
  );
}
