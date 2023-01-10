import { basename, dirname } from 'path';
import { BrowserWindow, dialog } from 'electron';
import type { Settings } from '../../interfaces/settings';
import { Download, DownloadState } from '../../interfaces/download';
import type { YoutubeDlReturn } from '../../utils/youtube/types';
import { fetchMetadata } from '../../utils/youtube/fetch-metadata';
import { typedIpcMain } from '../../utils/ipc';
import { startDownload } from '../utils/download';
import { prepareImage } from '../utils/image';
import { withoutExtension } from '../../utils/without-extension';
import { mainSettings } from '../settings';
import { Catalogue } from '../catalogue';
import { openContextMenu } from '../context-menu';

export const IPC_CHANNEL = 'ytdl';

export type IpcMsg<T extends string, D extends {} = {}> = {
  id: number;
  type: T;
} & D;

const youtubeDownloads = new Map<Download['id'], YoutubeDlReturn>();

export function setupMainIpc(mainWindow: BrowserWindow, catalogue: Catalogue) {
  typedIpcMain.registerTarget('main', mainWindow);

  typedIpcMain.on({ channel: IPC_CHANNEL }, async (msg) => {
    if (typedIpcMain.is(msg, 'openContextMenu')) {
      const { x, y, ...data } = msg.data;
      openContextMenu(
        catalogue,
        {
          window: mainWindow,
          x,
          y,
        },
        data
      );
    }

    if (
      typedIpcMain.is(msg, 'downloadAudio') ||
      typedIpcMain.is(msg, 'downloadVideo')
    ) {
      const id = catalogue.addDownload({
        url: msg.data.url,
        postProcess: msg.data.postProcess || {},
        format: msg.data.format,
      });
      startDownload(
        {
          id,
          catalogue,
          youtubeDownloads,
          msg,
        },
        msg.data
      );
    }

    if (typedIpcMain.is(msg, 'fetchMetadata')) {
      try {
        const data = await fetchMetadata(msg.data.url);
        msg.reply('fetchMetadataResult', data);
      } catch (error) {
        msg.reply('fetchMetadataError', {
          error: String(error),
        });
      }
    }

    if (typedIpcMain.is(msg, 'pickPath')) {
      const window = typedIpcMain.getWindow(msg.target);
      const pickResult = await dialog.showOpenDialog(window, msg.data);
      msg.reply('pickPathResult', pickResult.filePaths);
      msg.end();
    }

    if (typedIpcMain.is(msg, 'updateSettings')) {
      Object.entries(msg.data).forEach(([key, value]) => {
        mainSettings.set(key as keyof Settings, value);
      });
      mainSettings.save();
    }

    if (typedIpcMain.is(msg, 'prepareImage')) {
      try {
        const imagePath = await prepareImage(msg.data.from, msg.data.path, {
          maxBytes: mainSettings.get('downloads.audio.metadata.image.maxBytes'),
          resize: {
            enabled: mainSettings.get(
              'downloads.audio.metadata.image.resize.enabled'
            ),
            type: mainSettings.get(
              'downloads.audio.metadata.image.resize.type'
            ),
            width: mainSettings.get(
              'downloads.audio.metadata.image.resize.width'
            ),
            height: mainSettings.get(
              'downloads.audio.metadata.image.resize.height'
            ),
          },
          filename: msg.data.videoId,
        });
        msg.reply('prepareImageResult', {
          path: imagePath,
          url: `thumb://${basename(imagePath)}?t=${Date.now()}`,
        });
      } catch (error) {
        msg.reply('prepareImageResult', {
          error: (error as Error).toString(),
        });
      }
      msg.end();
    }

    if (typedIpcMain.is(msg, 'resumeDownload')) {
      const { id } = msg.data;
      const dl = catalogue.getDownload(id);
      if (!dl) {
        console.log(`Tried to resume a non existing download (id: ${id})`);
      } else {
        startDownload(
          { id, catalogue, youtubeDownloads, msg },
          {
            url: dl.url,
            outputFolder: dirname(dl.outputFile || dl.temporalFile),
            outputFile: withoutExtension(
              basename(dl.outputFile || dl.temporalFile)
            ),
            format: dl.format,
            postProcess: dl.postProcess,
          }
        );
      }
    }

    if (typedIpcMain.is(msg, 'stopDownload')) {
      const { id } = msg.data;
      catalogue.updateDownload({ id, state: DownloadState.PAUSED });

      const dl = youtubeDownloads.get(id);
      if (dl) {
        dl.stop();
        youtubeDownloads.delete(id);
      }
    }

    if (typedIpcMain.is(msg, 'removeDownload')) {
      const { id, removeData } = msg.data;
      catalogue.removeDownload(id, removeData);

      const dl = youtubeDownloads.get(id);
      if (dl) {
        dl.stop();
        youtubeDownloads.delete(id);
      }
    }
  });
}
