import { contextBridge, OpenDialogOptions } from 'electron';
import type { Settings } from '@interfaces/settings';
import {
  Download,
  DownloadPostProcessOptions,
  ImageToPrepareResult,
} from '@interfaces/download';
import { setupRendererIpc } from '@renderer/ipc';
import { IpcCommands } from '@utils/ipc/commands';
import { typedIpcRenderer } from '@utils/ipc';
import {
  YoutubeDlAudioFormat,
  YoutubeDlMetadata,
  YoutubeDlVideoFormat,
} from '@utils/youtube/types';

export type ElectronYtdl = typeof exposedYtdl;

export type DownloadOptions = {
  outputFolder: string;
  outputFile: string;
};

export type DownloadAudioOptions = DownloadOptions & {
  format?: YoutubeDlAudioFormat;
  postProcess?: DownloadPostProcessOptions;
};

export type DownloadVideoOptions = DownloadOptions & {
  format?: YoutubeDlVideoFormat;
};

const exposedYtdl = {
  setupRendererIpc,

  openContextMenu: (...props: Parameters<IpcCommands['openContextMenu']>) =>
    typedIpcRenderer.invoke('openContextMenu', ...props),

  downloadAudio: (url: string, options: DownloadAudioOptions) =>
    typedIpcRenderer.invoke('downloadAudio', {
      url,
      outputFolder: options.outputFolder,
      outputFile: options.outputFile,
      format: options.format || 'mp3',
      postProcess: options.postProcess,
    }),

  downloadVideo: (url: string, options: DownloadVideoOptions) =>
    typedIpcRenderer.invoke('downloadVideo', {
      url,
      outputFolder: options.outputFolder,
      outputFile: options.outputFile,
      format: options.format || 'best',
      postProcess: {},
    }),

  fetchMetadata: async (url: string): Promise<YoutubeDlMetadata> => {
    const res = await typedIpcRenderer.invoke('fetchMetadata', url);

    if (typeof res === 'string') {
      throw new Error(res);
    }

    return res;
  },

  pickFile: async (dialogOptions: OpenDialogOptions) =>
    typedIpcRenderer.invoke('pickPath', dialogOptions),

  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {
    typedIpcRenderer.invoke('updateSettings', {
      [key]: value,
    });
  },

  prepareImage: async (
    from: 'file' | 'url',
    path: string,
    videoId: YoutubeDlMetadata['id']
  ): Promise<ImageToPrepareResult | string> =>
    typedIpcRenderer.invoke('prepareImage', {
      from,
      path,
      videoId,
    }),

  removeDownload: (id: Download['id'], removeData: boolean): Promise<void> =>
    typedIpcRenderer.invoke('removeDownload', id, removeData),
};

contextBridge.exposeInMainWorld('ytdl', exposedYtdl);
