import { contextBridge, OpenDialogOptions } from 'electron';
import type { Settings } from '@interfaces/settings';
import {
  DownloadPostProcessOptions,
  ImageToPrepareResult,
} from '@interfaces/download';
import { setupRendererIpc } from '@renderer/ipc';
import { typedIpcRenderer } from '../utils/ipc';
import {
  YoutubeDlAudioOptions,
  YoutubeDlMetadata,
  YoutubeDlVideoOptions,
} from '../utils/youtube/types';

export type ElectronYtdl = typeof exposedYtdl;

const exposedYtdl = {
  setupIpc: setupRendererIpc,

  downloadAudio: (
    url: string,
    options: YoutubeDlAudioOptions & {
      postProcess?: DownloadPostProcessOptions;
    }
  ) => {
    const msg = typedIpcRenderer.createMessage('ytdl', 'downloadAudio', {
      url,
      outputFolder: options.outputFolder,
      outputFile: options.outputFile,
      format: options.format || 'mp3',
      postProcess: options.postProcess,
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
        options.onComplete?.(
          response.data.exitCode,
          response.data.downloadPath
        );
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
        options.onComplete?.(
          response.data.exitCode,
          response.data.downloadPath
        );
      }
    });

    msg.send();
  },

  fetchMetadata: (url: string): Promise<YoutubeDlMetadata> => {
    return new Promise<YoutubeDlMetadata>((resolve, reject) => {
      const msg = typedIpcRenderer.createMessage('ytdl', 'fetchMetadata', {
        url,
      });

      msg.onReply((response) => {
        if (typedIpcRenderer.is(response, 'ytdlError')) {
          reject(response.data);
        }

        if (typedIpcRenderer.is(response, 'fetchMetadataResult')) {
          resolve(response.data);
        }
      });

      msg.send();
    });
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

  prepareImage: (
    from: 'file' | 'url',
    path: string,
    videoId: YoutubeDlMetadata['id']
  ): Promise<ImageToPrepareResult> => {
    return new Promise<ImageToPrepareResult>((resolve) => {
      const msg = typedIpcRenderer.createMessage('ytdl', 'prepareImage', {
        from,
        path,
        videoId,
      });
      msg.onReply((reply) => {
        if (typedIpcRenderer.is(reply, 'prepareImageResult')) {
          resolve(reply.data);
        }
      });
      msg.send();
    });
  },
};

contextBridge.exposeInMainWorld('ytdl', exposedYtdl);
