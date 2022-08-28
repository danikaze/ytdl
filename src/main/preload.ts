import { contextBridge, OpenDialogOptions } from 'electron';
import type { Settings } from '@interfaces/settings';
import { setupRendererIpc } from '@renderer/ipc';
import { typedIpcRenderer } from '../utils/ipc';
import { YoutubeDlAudioOptions } from './youtube/types';

export type ElectronYtdl = typeof exposedYtdl;

const exposedYtdl = {
  setupIpc: setupRendererIpc,
  downloadAudio: (url: string, options: YoutubeDlAudioOptions) => {
    const msg = typedIpcRenderer.createMessage('ytdl', 'downloadAudio', {
      url,
      outputFolder: options.outputFolder,
      outputFile: options.outputFile,
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
  pickFile: (dialogOptions: OpenDialogOptions) => {
    return new Promise<readonly string[] | undefined>((resolve) => {
      const msg = typedIpcRenderer.createMessage(
        'ytdl',
        'pickPath',
        dialogOptions
      );
      msg.onReply((reply) => {
        if (typedIpcRenderer.is(reply, 'pickPathResult')) {
          resolve(reply.data);
        }
      });
      msg.send();
    });
  },
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const msg = typedIpcRenderer.createMessage('ytdl', 'updateSettings', {
      [key]: value,
    });
    msg.send();
  },
};

contextBridge.exposeInMainWorld('ytdl', exposedYtdl);
