import { basename } from 'path';
import { BrowserWindow, dialog } from 'electron';
import type { Settings } from '../../interfaces/settings';
import { Download, DownloadState } from '../../interfaces/download';
import type {
  YoutubeDlAudioOptions,
  YoutubeDlVideoOptions,
} from '../../utils/youtube/types';
import { downloadAudio } from '../../utils/youtube/download-audio';
import { downloadVideo } from '../../utils/youtube/download-video';
import { fetchMetadata } from '../../utils/youtube/fetch-metadata';
import { IpcMessagesData } from '../../utils/ipc/msgs';
import { typedIpcMain } from '../../utils/ipc';
import { processAudio } from '../../utils/audio';
import { IpcMainIncomingMessage } from '../../utils/ipc/private/main-message';
import { prepareImage } from '../utils/image';
import { mainSettings } from '../settings';
import { Catalogue } from '../catalogue';
import { openContextMenu } from '../context-menu';

export const IPC_CHANNEL = 'ytdl';

export type IpcMsg<T extends string, D extends {} = {}> = {
  id: number;
  type: T;
} & D;

export function setupMainIpc(mainWindow: BrowserWindow, catalogue: Catalogue) {
  typedIpcMain.registerTarget('main', mainWindow);

  typedIpcMain.on({ channel: IPC_CHANNEL }, async (msg) => {
    if (typedIpcMain.is(msg, 'openContextMenu')) {
      const { x, y, ...data } = msg.data;
      openContextMenu(
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
      const ytdlUpdate = getYtdlUpdate(catalogue, msg);

      const options: YoutubeDlAudioOptions | YoutubeDlVideoOptions = {
        outputFolder: msg.data.outputFolder,
        outputFile: msg.data.outputFile,
        format: msg.data.format,
        onStart: async ({ temporalFile }) => {
          catalogue.updateDownload({ id, temporalFile });
          msg.reply('ytdlStart', catalogue.getDownload(id)!);
        },
        onComplete: async (exitCode, downloadPath) => {
          if (exitCode) {
            ytdlUpdate({
              id,
              state: DownloadState.ERRORED,
              speed: null,
              eta: null,
            });
            return;
          }

          if (typedIpcMain.is(msg, 'downloadAudio')) {
            if (msg.data.format === 'mp3' && msg.data.postProcess?.audio) {
              ytdlUpdate({ id, state: DownloadState.PROCESSING });
              try {
                await processAudio(downloadPath, msg.data.postProcess.audio);
              } catch (rawError) {
                const error = `Error while processing audio ${(
                  rawError as Error
                ).toString()}`;
                ytdlUpdate({ id, error });
              }
            }
          }

          ytdlUpdate({
            id,
            state: DownloadState.COMPLETED,
            downloadPctg: 100,
            speed: null,
            eta: null,
          });
          msg.end();
        },
        onUpdate: (update) => {
          ytdlUpdate({
            id,
            state: DownloadState.DOWNLOADING,
            ...update,
          });
        },
        onError: (error) => {
          ytdlUpdate({
            id,
            error,
            state: DownloadState.ERRORED,
            speed: null,
            eta: null,
          });
        },
      };
      if (typedIpcMain.is(msg, 'downloadAudio')) {
        downloadAudio(msg.data.url, options as YoutubeDlAudioOptions);
      } else {
        downloadVideo(msg.data.url, options as YoutubeDlVideoOptions);
      }
    }

    if (typedIpcMain.is(msg, 'fetchMetadata')) {
      try {
        const data = await fetchMetadata(msg.data.url);
        msg.reply('fetchMetadataResult', data);
      } catch (error) {
        msg.reply('ytdlError', String(error));
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
  });
}

function getYtdlUpdate(
  catalogue: Catalogue,
  msg: IpcMainIncomingMessage<
    'main',
    'ytdl',
    IpcMessagesData,
    'downloadAudio' | 'downloadVideo'
  >
) {
  return (
    data: Pick<Download, 'id'> & Nullable<Partial<Omit<Download, 'id'>>>
  ) => {
    catalogue.updateDownload(data);
    msg.reply('ytdlUpdate', data);
  };
}
