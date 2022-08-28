import type { OpenDialogOptions } from 'electron';
import type { AppScreen } from '@interfaces/app';
import type {
  YoutubeDlAudioFormat,
  YoutubeDlProgress,
} from '@main/youtube/types';
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
  };
  downloadAudioProgress: YoutubeDlProgress;
  downloadAudioError: string;
  downloadAudioComplete: number | null;
  pickPath: OpenDialogOptions;
  pickPathResult: string[] | undefined;
  initSettings: Settings;
  updateSettings: Partial<Settings>;
}
