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
  /*
   * meta data and site data
   */
  /** Video identifier */
  id: string;
  /** An alternative identifier for the video */
  display_id: string;
  /** Requested video webpage */
  webpage_url: string;
  /** */
  webpage_url_basename: 'watch';
  /** Number of positive ratings of the video */
  like_count: 3819;
  /** How many users have watched the video on the platform */
  view_count: number;
  /** Full name of the video uploader */
  uploader: string;
  /** Nickname or id of the video uploader */
  uploader_id: string;
  /** Same as channel_url? */
  uploader_url: string;
  /** Video upload date (YYYYMMDD) */
  upload_date: string;
  /** Full name of the channel the video is uploaded on */
  channel: string;
  /** Id of the channel */
  channel_id: string;
  /** URL of the channel the video is uploaded on */
  channel_url: string;
  /** URL of the thumbnail with default max resolution */
  thumbnail: string;
  /** List of URLs for thumbnails with various sizes */
  thumbnails: YoutubeDlMetadataThumbnail[];
  /** Video title */
  title: string;
  /** */
  fulltitle: string;
  /** Age restriction for the video (years) */
  age_limit: number;
  /** List of user-added tags */
  tags: string[];
  /** */
  categories: string[];
  /** Description of the video */
  description: string;
  /** Whether this video is a live stream or a fixed-length video */
  is_live?: boolean;
  /** Name or id of the playlist that contains the video */
  playlist?: string;
  /** Index of the video in the playlist padded with leading zeros according to the total length of the playlist */
  playlist_index?: number;

  /*
   * video data
   */
  /** Length of the video in seconds */
  duration: number;
  /** Video filename extension */
  ext: string;
  /** A human-readable description of the format */
  format: string;
  /** Format code specified by --format */
  format_id: string;
  /** Frame rate */
  fps: number;
  /** Name of the audio codec in use */
  acodec: string;
  /** Average audio bitrate in KBit/s */
  abr: number;
  /** Name of the video codec in use */
  vcodec: string;
  /** Average video bitrate in KBit/s */
  vbr: number;
  /** Width of the video */
  width: number;
  /** Height of the video */
  height: number;
  /** List of available subtitles as { language: file[] } */
  subtitles: Record<string, YoutubeDlMetadataSubtitle[]>;

  /*
   * App data
   */
  /** Name of the extractor */
  extractor: 'youtube';
  /** Key name of the extractor */
  extractor_key: 'Youtube';
  /** List of the requested formats by default */
  requested_formats: YoutubeDlMetadataFormat[];
  /** List of the requested subtitles by default */
  requested_subtitles: YoutubeDlMetadataSubtitle[];
}

export interface YoutubeDlMetadataThumbnail {
  id: string;
  resolution: string;
  url: string;
  width: number;
  height: number;
}

export interface YoutubeDlMetadataSubtitle {
  ext: string;
  url: string;
}

export type YoutubeDlMetadataFormat =
  | YoutubeDlMetadataVideoFormat
  | YoutubeDlMetadataAudioFormat;

export interface YoutubeDlMetadataAudioFormat {
  abr: number;
  acodec: string;
  asr: number;
  container: string;
  downloader_options: {};
  ext: string;
  filesize: number;
  format: string;
  format_id: string;
  format_note: string;
  fps: null;
  height: null;
  http_headers: Record<string, string>;
  protocol: string;
  quality: number;
  tbr: number;
  url: string;
  vcodec: 'none';
  width: null;
}

export interface YoutubeDlMetadataVideoFormat {
  acodec: 'none';
  asr: null;
  container: string;
  downloader_options: {};
  ext: string;
  filesize: number;
  format: string;
  format_id: string;
  format_note: string;
  fps: number;
  height: number;
  http_headers: Record<string, string>;
  protocol: string;
  quality: number;
  tbr: number;
  url: string;
  vbr: number;
  vcodec: string;
  width: number;
}
/* eslint-enable @typescript-eslint/naming-convention */
