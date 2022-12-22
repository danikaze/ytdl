import type { Download } from '@interfaces/download';
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
        console.log('Removing download ', data.id);
      },
    },
  ];
}
