import type { OpenDialogOptions } from 'electron';
import type {
  YoutubeDlAudioFormat,
  YoutubeDlMetadata,
  YoutubeDlVideoFormat,
} from '@utils/youtube/types';
import {
  Download,
  DownloadPostProcessOptions,
  ImageToPrepare,
  ImageToPrepareResult,
} from '@interfaces/download';
import { Settings } from '@interfaces/settings';

/**
 * Definition of available RPCs
 *
 * Used via `invoke`/`handle`
 */
export type IpcCommands = {
  openContextMenu: (data: { x: number; y: number }) => void;
  downloadAudio: (data: {
    url: string;
    format: YoutubeDlAudioFormat;
    outputFolder: string;
    outputFile: string;
    postProcess?: DownloadPostProcessOptions;
  }) => void;
  downloadVideo: (data: {
    url: string;
    format: YoutubeDlVideoFormat;
    outputFolder: string;
    outputFile: string;
    postProcess?: {};
  }) => void;
  fetchMetadata: (url: string) => Promise<YoutubeDlMetadata | string>;
  pickPath: (options: OpenDialogOptions) => Promise<string[] | false>;
  updateSettings: (settings: Partial<Settings>) => void;
  prepareImage: (
    image: ImageToPrepare
  ) => Promise<ImageToPrepareResult | string>;
  removeDownload: (id: Download['id'], removeData: boolean) => void;
  stopDownload: (id: Download['id']) => void;
  resumeDownload: (id: Download['id']) => void;
};
