import { MenuItemConstructorOptions } from 'electron';
import { Download, DownloadState } from '../../interfaces/download';
import { typedIpcMain } from '../../utils/ipc';
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

function getStopResumeMenu(download: Download): MenuItemConstructorOptions[] {
  if (isStopped(download)) {
    return [
      {
        label: 'Resume',
        click: () => {
          if (!isStopped(download)) return;

          const msg = typedIpcMain.createMessage(
            'main',
            'ytdl',
            'requestIpcMsg',
            {
              type: 'resumeDownload',
              data: {
                id: download.id,
              },
            }
          );
          msg.send();
          msg.end();
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

          const msg = typedIpcMain.createMessage(
            'main',
            'ytdl',
            'requestIpcMsg',
            {
              type: 'stopDownload',
              data: {
                id: download.id,
              },
            }
          );
          msg.send();
          msg.end();
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
