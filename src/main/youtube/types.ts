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

export interface YoutubeDlOptions {
  args: string[];
  onProgress?: (progress: YoutubeDlProgress) => void;
  onError?: (data: string) => void;
  onComplete?: (code: number | null) => void;
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
