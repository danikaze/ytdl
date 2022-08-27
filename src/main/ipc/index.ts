import { BrowserWindow, dialog } from 'electron';
import { YoutubeDlAudioOptions } from '@main/youtube/types';
import { typedIpcMain } from '../../utils/ipc';
import { downloadAudio } from '../youtube';

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
        format: msg.data.format,
        onComplete: (exitCode) => {
          msg.reply('downloadAudioComplete', exitCode);
          msg.end();
        },
        onProgress: (progress) => msg.reply('downloadAudioProgress', progress),
        onError: (error) => msg.reply('downloadAudioError', error),
      };
      downloadAudio(msg.data.url, options);
    }

    if (typedIpcMain.is(msg, 'pickPath')) {
      const window = typedIpcMain.getWindow(msg.target);
      const pickResult = await dialog.showOpenDialog(window, msg.data);
      msg.reply('pickPathResult', pickResult.filePaths);
    }
  });
}
