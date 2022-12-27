import { ChangeEvent, useState } from 'react';
import { useAppUi } from '@renderer/jotai/ui';
import { useDownloads } from '@renderer/jotai/downloads';

export function useConfirmationDownloadRemovalDialog() {
  const { confirmDownloadId, setConfirmDownloadId } = useAppUi();
  const { removeDownload } = useDownloads();
  const [removeData, setRemoveData] = useState<boolean>(false);

  function onConfirm() {
    removeDownload(confirmDownloadId!, removeData);
    setConfirmDownloadId(undefined);
  }

  function onClose() {
    setConfirmDownloadId(undefined);
  }

  function onCheckboxUpdate(ev: ChangeEvent<HTMLInputElement>) {
    setRemoveData(ev.target.checked);
  }

  return {
    isShown: confirmDownloadId !== undefined,
    removeData,
    onConfirm,
    onClose,
    onCheckboxUpdate,
  };
}
