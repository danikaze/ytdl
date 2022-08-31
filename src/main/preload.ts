import { contextBridge, OpenDialogOptions } from 'electron';
import type { Settings } from '@interfaces/settings';
import { setupRendererIpc } from '@renderer/ipc';
import { typedIpcRenderer } from '../utils/ipc';
import {
  YoutubeDlAudioOptions,
  YoutubeDlVideoOptions,
} from '../utils/youtube/types';

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
      if (typedIpcRenderer.is(response, 'ytdlUpdate')) {
        options.onUpdate?.(response.data);
        return;
      }

      if (typedIpcRenderer.is(response, 'ytdlError')) {
        options.onError?.(response.data);
        return;
      }

      if (typedIpcRenderer.is(response, 'ytdlComplete')) {
        options.onComplete?.(response.data);
      }
    });

    msg.send();
  },

  downloadVideo: (url: string, options: YoutubeDlVideoOptions) => {
    const msg = typedIpcRenderer.createMessage('ytdl', 'downloadVideo', {
      url,
      outputFolder: options.outputFolder,
      outputFile: options.outputFile,
      format: options.format || 'best',
    });

    msg.onReply((response) => {
      if (typedIpcRenderer.is(response, 'ytdlUpdate')) {
        options.onUpdate?.(response.data);
        return;
      }

      if (typedIpcRenderer.is(response, 'ytdlError')) {
        options.onError?.(response.data);
        return;
      }

      if (typedIpcRenderer.is(response, 'ytdlComplete')) {
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
