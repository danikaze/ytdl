import { YoutubeDlAudioOptions } from '@main/youtube/types';
import { typedIpcMain } from '../../utils/ipc';
import { downloadAudio } from '../youtube';

export const IPC_CHANNEL = 'ytdl';

export type IpcMsg<T extends string, D extends {} = {}> = {
  id: number;
  type: T;
} & D;

export function setupIpc() {
  typedIpcMain.on({ channel: IPC_CHANNEL }, async (msg) => {
    if (typedIpcMain.is(msg, 'downloadAudio')) {
      const options: YoutubeDlAudioOptions = {
        format: msg.data.format,
        onComplete: () => msg.end(),
        onProgress: (progress) => msg.reply('downloadAudioProgress', progress),
        onError: (error) => msg.reply('downloadAudioError', error),
      };
      downloadAudio(msg.data.url, options);
    }
  });
}
