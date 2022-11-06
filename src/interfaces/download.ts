import { YoutubeDlMetadata } from '@utils/youtube/types';
import type { Tags } from 'node-id3';

export const enum DownloadState {
  INITIALIZATING,
  DOWNLOADING_WEBPAGE,
  DOWNLOADING,
  PROCESSING,
  STORING,
  COMPLETED,
  ERRORED,
  PAUSED,
}

export interface Download {
  id: string;
  state: DownloadState;
  url: string;
  downloadPctg: number;
  temporalFile: string;
  size?: string;
  speed?: number;
  eta?: number;
  error?: string;
  postProcess: DownloadPostProcessOptions;
}

export interface DownloadPostProcessOptions {
  audio?: AudioProcessOptions;
}

export interface AudioProcessOptions {
  metadata?: Partial<
    Record<KeysOfWithValue<Required<Tags>, string>, string>
  > & {
    frontCover?: string;
  };
}

export interface AudioProcessImageOptions {
  resize: {
    enabled: boolean;
    type: 'contain' | 'cover';
    crop: boolean;
    width?: number;
    height?: number;
  };
  maxBytes?: number;
}

export interface ImageToPrepare {
  from: 'file' | 'url';
  path: string;
  videoId: YoutubeDlMetadata['id'];
}

export type ImageToPrepareResult =
  | ImageToPrepareResultOk
  | ImageToPrepareResultError;
export interface ImageToPrepareResultOk {
  // path to use for the metadata
  path: string;
  // url to use for the preview
  url: string;
}

export interface ImageToPrepareResultError {
  error: string;
}
