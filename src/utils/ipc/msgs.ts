import type {
  YoutubeDlAudioFormat,
  YoutubeDlProgress,
} from '@main/youtube/types';

export interface IpcMessagesData {
  downloadAudio: {
    url: string;
    format: YoutubeDlAudioFormat;
  };
  downloadAudioProgress: YoutubeDlProgress;
  downloadAudioError: string;
}
