import { setupRendererIpc } from '@renderer/ipc';
import { contextBridge } from 'electron';
import { typedIpcRenderer } from '../utils/ipc';
import { YoutubeDlAudioOptions } from './youtube/types';

export type ElectronYtdl = typeof exposedYtdl;

const exposedYtdl = {
  setupIpc: setupRendererIpc,
  downloadAudio: (url: string, options: YoutubeDlAudioOptions = {}) => {
    const msg = typedIpcRenderer.createMessage('ytdl', 'downloadAudio', {
      url,
      format: options.format || 'mp3',
    });

    msg.onReply((response) => {
      if (typedIpcRenderer.is(response, 'downloadAudioProgress')) {
        options.onProgress?.({
          percentage: response.data.percentage,
          speed: response.data.speed,
          eta: response.data.eta,
          size: response.data.size,
        });
        return;
      }

      if (typedIpcRenderer.is(response, 'downloadAudioError')) {
        options.onError?.(response.data);
      }

      if (typedIpcRenderer.is(response, 'downloadAudioComplete')) {
        options.onComplete?.(response.data);
      }
    });

    msg.send();
  },
};

contextBridge.exposeInMainWorld('ytdl', exposedYtdl);
