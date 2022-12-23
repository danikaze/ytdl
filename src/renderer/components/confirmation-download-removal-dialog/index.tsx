import { Dialog, Text } from 'evergreen-ui';
import { useAppUi } from '@renderer/jotai/ui';
import { useDownloads } from '@renderer/jotai/downloads';

export function ConfirmationDownloadRemovalDialog(): JSX.Element {
  const { confirmDownloadId, setConfirmDownloadId } = useAppUi();
  const { removeDownload } = useDownloads();

  return (
    <Dialog
      isShown={confirmDownloadId !== undefined}
      title="Remove download"
      onCloseComplete={() => setConfirmDownloadId(undefined)}
      onConfirm={() => {
        removeDownload(confirmDownloadId!);
        setConfirmDownloadId(undefined);
      }}
    >
      <Text>Do you want to remove the download?</Text>
    </Dialog>
  );
}
