import type { OpenDialogOptions } from 'electron';
import type {
  YoutubeDlAudioFormat,
  YoutubeDlMetadata,
  YoutubeDlVideoFormat,
} from '@utils/youtube/types';
import type { AppScreen } from '@interfaces/app';
import {
  Download,
  DownloadPostProcessOptions,
  ImageToPrepare,
  ImageToPrepareResult,
} from '@interfaces/download';
import { Settings } from '@interfaces/settings';

export interface IpcMessagesData {
  requestIpcMsg: {
    type: keyof IpcMessagesData;
    data: IpcMessagesData[keyof IpcMessagesData];
  };
  changeScreen: {
    screen: AppScreen;
  };
  openContextMenu: {
    x: number;
    y: number;
  };
  downloadAudio: {
    url: string;
    format: YoutubeDlAudioFormat;
    outputFolder: string;
    outputFile: string;
    postProcess?: DownloadPostProcessOptions;
  };
  downloadVideo: {
    url: string;
    format: YoutubeDlVideoFormat;
    outputFolder: string;
    outputFile: string;
    postProcess?: {};
  };
  fetchMetadata: {
    url: string;
  };
  fetchMetadataResult: YoutubeDlMetadata;
  fetchMetadataError: { error: string };
  ytdlStart: Download;
  ytdlUpdate: Pick<Download, 'id'> & Nullable<Partial<Omit<Download, 'id'>>>;
  pickPath: OpenDialogOptions;
  pickPathResult: string[] | undefined;
  initApp: {
    settings: Settings;
    downloads: Download[];
  };
  updateSettings: Partial<Settings>;
  prepareImage: ImageToPrepare;
  prepareImageResult: ImageToPrepareResult;
  confirmDownloadRemoval: Pick<Download, 'id'>;
  resumeDownload: Pick<Download, 'id'>;
  stopDownload: Pick<Download, 'id'>;
  removeDownload: {
    id: Download['id'];
    removeData: boolean;
  };
}
