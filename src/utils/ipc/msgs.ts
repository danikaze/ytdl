import type { AppScreen } from '@interfaces/app';
import type {
  YoutubeDlAudioFormat,
  YoutubeDlProgress,
} from '@main/youtube/types';

export interface IpcMessagesData {
  changeScreen: {
    screen: AppScreen;
  };
  downloadAudio: {
    url: string;
    format: YoutubeDlAudioFormat;
  };
  downloadAudioProgress: YoutubeDlProgress;
  downloadAudioError: string;
  downloadAudioComplete: number | null;
}
