import { IpcMsg } from '..';
import { YoutubeDlProgress } from '../../../utils/youtube/types';

export type DownloadAudioMsg = IpcMsg<
  'downloadAudio',
  {
    url: string;
    format: string;
  }
>;

export type DownloadAudioResponseMsg = IpcMsg<'progress', YoutubeDlProgress>;
