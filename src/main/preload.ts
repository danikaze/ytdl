import { contextBridge, OpenDialogOptions } from 'electron';
import type { Settings } from '@interfaces/settings';
import {
  Download,
  DownloadPostProcessOptions,
  ImageToPrepareResult,
} from '@interfaces/download';
import { setupRendererIpc } from '@renderer/ipc';
import { typedIpcRenderer } from '../utils/ipc';
import type { IpcMessagesData } from '../utils/ipc/msgs';
import {
  YoutubeDlAudioFormat,
  YoutubeDlMetadata,
  YoutubeDlVideoFormat,
} from '../utils/youtube/types';

export type ElectronYtdl = typeof exposedYtdl;

export type DownloadOptions = {
  outputFolder: string;
  outputFile: string;
  onStart?: (download: Download) => void;
  onUpdate?: (
    download: Pick<Download, 'id'> & Nullable<Partial<Omit<Download, 'id'>>>
  ) => void;
};

export type DownloadAudioOptions = DownloadOptions & {
  format?: YoutubeDlAudioFormat;
  postProcess?: DownloadPostProcessOptions;
};

export type DownloadVideoOptions = DownloadOptions & {
  format?: YoutubeDlVideoFormat;
};

const exposedYtdl = {
  setupIpc: setupRendererIpc,

  openContextMenu: (props: IpcMessagesData['openContextMenu']) => {
    const msg = typedIpcRenderer.createMessage(
      'ytdl',
      'openContextMenu',
      props
    );
    msg.send();
    msg.end();
  },

  downloadAudio: (url: string, options: DownloadAudioOptions) => {
    const msg = typedIpcRenderer.createMessage('ytdl', 'downloadAudio', {
      url,
      outputFolder: options.outputFolder,
      outputFile: options.outputFile,
      format: options.format || 'mp3',
      postProcess: options.postProcess,
    });

    msg.onReply((response) => {
      if (typedIpcRenderer.is(response, 'ytdlStart')) {
        options.onStart?.(response.data);
        return;
      }

      if (typedIpcRenderer.is(response, 'ytdlUpdate')) {
        options.onUpdate?.(response.data);
        // return;
      }
    });

    msg.send();
  },

  downloadVideo: (url: string, options: DownloadVideoOptions) => {
    const msg = typedIpcRenderer.createMessage('ytdl', 'downloadVideo', {
      url,
      outputFolder: options.outputFolder,
      outputFile: options.outputFile,
      format: options.format || 'best',
      postProcess: {},
    });

    msg.onReply((response) => {
      if (typedIpcRenderer.is(response, 'ytdlStart')) {
        options.onStart?.(response.data);
        return;
      }

      if (typedIpcRenderer.is(response, 'ytdlUpdate')) {
        options.onUpdate?.(response.data);
        // return;
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

  removeDownload: (id: Download['id'], removeData: boolean): void => {
    const msg = typedIpcRenderer.createMessage('ytdl', 'removeDownload', {
      id,
      removeData,
    });
    msg.send();
  },
};

contextBridge.exposeInMainWorld('ytdl', exposedYtdl);
