import type { OpenDialogOptions } from 'electron';
import type {
  YoutubeDlAudioFormat,
  YoutubeDlMetadata,
  YoutubeDlUpdate,
  YoutubeDlVideoFormat,
} from '@utils/youtube/types';
import type { AppScreen } from '@interfaces/app';
import { DownloadPostProcessOptions } from '@interfaces/download';
import { Settings } from '@interfaces/settings';

export interface IpcMessagesData {
  changeScreen: {
    screen: AppScreen;
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
  };
  fetchMetadata: {
    url: string;
  };
  fetchMetadataResult: YoutubeDlMetadata;
  ytdlUpdate: YoutubeDlUpdate;
  ytdlError: string;
  ytdlComplete: number | null;
  pickPath: OpenDialogOptions;
  pickPathResult: string[] | undefined;
  initSettings: Settings;
  updateSettings: Partial<Settings>;
}
