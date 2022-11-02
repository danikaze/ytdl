import { BrowserWindow, dialog } from 'electron';
import type { Settings } from '../../interfaces/settings';
import { DownloadState } from '../../interfaces/download';
import type {
  YoutubeDlAudioOptions,
  YoutubeDlVideoOptions,
} from '../../utils/youtube/types';
import { downloadAudio } from '../../utils/youtube/download-audio';
import { downloadVideo } from '../../utils/youtube/download-video';
import { fetchMetadata } from '../../utils/youtube/fetch-metadata';
import { typedIpcMain } from '../../utils/ipc';
import { processAudio } from '../../utils/audio';
import { mainSettings } from '../settings';

export const IPC_CHANNEL = 'ytdl';

export type IpcMsg<T extends string, D extends {} = {}> = {
  id: number;
  type: T;
} & D;

export function setupMainIpc(mainWindow: BrowserWindow) {
  typedIpcMain.registerTarget('main', mainWindow);

  typedIpcMain.on({ channel: IPC_CHANNEL }, async (msg) => {
    if (typedIpcMain.is(msg, 'downloadAudio')) {
      const options: YoutubeDlAudioOptions = {
        outputFolder: msg.data.outputFolder,
        outputFile: msg.data.outputFile,
        format: msg.data.format,
        onComplete: async (exitCode, downloadPath) => {
          if (msg.data.format === 'mp3' && msg.data.postProcess?.audio) {
            msg.reply('ytdlUpdate', { state: DownloadState.PROCESSING });
            try {
              await processAudio(downloadPath, msg.data.postProcess.audio);
            } catch (error) {
              msg.reply(
                'ytdlError',
                `Error while processing audio ${(error as Error).toString()}`
              );
            }
          }
          msg.reply('ytdlComplete', { exitCode, downloadPath });
          msg.end();
        },
        onUpdate: (update) => msg.reply('ytdlUpdate', update),
        onError: (error) => msg.reply('ytdlError', error),
      };
      downloadAudio(msg.data.url, options);
    }

    if (typedIpcMain.is(msg, 'downloadVideo')) {
      const options: YoutubeDlVideoOptions = {
        outputFolder: msg.data.outputFolder,
        outputFile: msg.data.outputFile,
        format: msg.data.format,
        onComplete: (exitCode, downloadPath) => {
          msg.reply('ytdlComplete', { exitCode, downloadPath });
          msg.end();
        },
        onUpdate: (update) => msg.reply('ytdlUpdate', update),
        onError: (error) => msg.reply('ytdlError', error),
      };
      downloadVideo(msg.data.url, options);
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
    }

    if (typedIpcMain.is(msg, 'updateSettings')) {
      Object.entries(msg.data).forEach(([key, value]) => {
        mainSettings.set(key as keyof Settings, value);
      });
      mainSettings.save();
    }
  });
}
