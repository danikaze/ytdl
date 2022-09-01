import type { Download } from '@interfaces/download';

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

/* eslint-disable @typescript-eslint/naming-convention */
export interface YoutubeDlMetadata {
  // meta data
  id: string;
  display_id: string;
  webpage_url: string;
  webpage_url_basename: string;

  // video data
  thumbnail: string;
  thumbnails: YoutubeDlMetadataThumbnail[];
  title: string;
  fulltitle: string;
  duration: number; // seconds
  fps: number;
  vbr: number;
  width: number;
  height: number;
  categories: string[];
  tags: string[];

  // sns data
  like_count: 3819;
  view_count: number;
  uploader: string;
  uploader_id: string;
  uploader_url: string;
  channel: string;
  channel_id: string;
  channel_url: string;
}

export interface YoutubeDlMetadataThumbnail {
  id: string;
  resolution: string;
  url: string;
  width: number;
  height: number;
}
/* eslint-enable @typescript-eslint/naming-convention */
