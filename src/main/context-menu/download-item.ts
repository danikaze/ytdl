import { MenuItemConstructorOptions } from 'electron';
import { Download, DownloadState } from '../../interfaces/download';
import { ipcToWindow } from '../../utils/ipc';
import type { Catalogue } from '../catalogue';
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
  catalogue: Catalogue,
  data: DownloadItemContextMenuData
): ContextMenuTemplate {
  const download = catalogue.getDownload(data.id);
  if (!download) return [];

  return [
    ...getStopResumeMenu(download),
    {
      label: 'Remove',
      click: () => {
        ipcToWindow('main', 'confirmDownloadRemoval', data.id);
      },
    },
  ];
}

function getStopResumeMenu(download: Download): MenuItemConstructorOptions[] {
  if (isStopped(download)) {
    return [
      {
        label: 'Resume',
        click: () => {
          if (!isStopped(download)) return;

          ipcToWindow('main', 'triggerIpcCommand', {
            command: 'resumeDownload',
            args: [download.id],
          });
        },
      },
    ];
  }

  if (isDownloading(download)) {
    return [
      {
        label: 'Stop',
        click: () => {
          if (!isDownloading(download)) return;

          ipcToWindow('main', 'triggerIpcCommand', {
            command: 'stopDownload',
            args: [download.id],
          });
        },
      },
    ];
  }

  return [];
}

function isStopped(download: Download): boolean {
  return (
    download.state === DownloadState.PAUSED ||
    download.state === DownloadState.ERRORED
  );
}

function isDownloading(download: Download): boolean {
  return (
    download.state === DownloadState.DOWNLOADING ||
    download.state === DownloadState.DOWNLOADING_WEBPAGE ||
    download.state === DownloadState.INITIALIZATING
  );
}
