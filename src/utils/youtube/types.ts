import { Download } from '@interfaces/download';

export type YoutubeDlAudioFormat =
  | 'best'
  | 'aac'
  | 'flac'
  | 'mp3'
  | 'm4a'
  | 'opus'
  | 'vorbis'
  | 'wav';

export interface YoutubeDlAudioOptions extends Omit<YoutubeDlOptions, 'args'> {
  format?: YoutubeDlAudioFormat;
}

export type YoutubeDlVideoFormat =
  | '3gp'
  | 'aac'
  | 'flv'
  | 'm4a'
  | 'mp3'
  | 'mp4'
  | 'ogg'
  | 'wav'
  | 'webm'
  | 'best'
  | 'worst'
  | 'bestvideo'
  | 'worstvideo'
  | 'bestaudio'
  | 'worstaudio';

export interface YoutubeDlVideoOptions extends Omit<YoutubeDlOptions, 'args'> {
  format?: YoutubeDlVideoFormat;
}

export interface YoutubeDlOptions {
  args: string[];
  outputFolder: string;
  outputFile: string;
  onUpdate?: (progress: YoutubeDlUpdate) => void;
  onError?: (data: string) => void;
  onComplete?: (code: number | null) => void;
}

export type YoutubeDlUpdate = YoutubeDlStateUpdate | YoutubeDlProgress;

export interface YoutubeDlStateUpdate {
  state: Download['state'];
}

export interface YoutubeDlProgress {
  /** Percentage donwloaded as 0-100 */
  percentage: number | undefined;
  /** Download speed as b/s */
  speed: number | undefined;
  /** Seconds remaining */
  eta: number | undefined;
  /** Size as reported (i.e. `"79.30KiB/s"`) */
  size: string | undefined;
}

export function isStateUpdate(
  update: YoutubeDlUpdate
): update is YoutubeDlStateUpdate {
  return (update as YoutubeDlStateUpdate).state !== undefined;
}

export function isProgressUpdate(
  update: YoutubeDlUpdate
): update is YoutubeDlProgress {
  return (update as YoutubeDlProgress).percentage !== undefined;
}
