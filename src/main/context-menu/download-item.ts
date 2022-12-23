import type { Download } from '../../interfaces/download';
import { typedIpcMain } from '../../utils/ipc';
import type { ContextMenuTemplate } from '.';

export interface DownloadItemContextMenuData {
  type: 'downloadItem';
  id: Download['id'];
}

export function isDownloadItemContext(
  data: unknown
): data is DownloadItemContextMenuData {
  return (data as DownloadItemContextMenuData).type === 'downloadItem';
}

export function createDownloadItemContextMenu(
  data: DownloadItemContextMenuData
): ContextMenuTemplate {
  return [
    {
      label: 'Remove',
      click: () => {
        const msg = typedIpcMain.createMessage(
          'main',
          'ytdl',
          'confirmDownloadRemoval',
          {
            id: data.id,
          }
        );
        msg.send();
        msg.end();
      },
    },
  ];
}
