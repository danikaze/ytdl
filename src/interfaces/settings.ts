import type {
  YoutubeDlAudioFormat,
  YoutubeDlVideoFormat,
} from '@utils/youtube/types';

export const LAST_VALUE = '_LAST_';
export type LastValue = typeof LAST_VALUE;
export type DownloadType = 'audio' | 'video';

export type Settings = WithLastValues<
  {
    // app
    'app.youtubeDlVersion': string;
    // downloads
    'downloads.downloadFolder': string;
    'downloads.useTemporalFolder': boolean;
    'downloads.temporalFolder': string;
    'downloads.downloadType': DownloadType;
    'downloads.audio.audioFormat': YoutubeDlAudioFormat;
    'downloads.audio.metadata.image.maxBytes': number;
    'downloads.audio.metadata.image.resize.enabled': boolean;
    'downloads.audio.metadata.image.resize.type': 'cover' | 'contain';
    'downloads.audio.metadata.image.resize.width': number;
    'downloads.audio.metadata.image.resize.height': number;
    'downloads.video.videoFormat': YoutubeDlVideoFormat;
  },
  // list of settings with "last used"
  | 'downloads.downloadFolder'
  | 'downloads.downloadType'
  | 'downloads.audio.audioFormat'
  | 'downloads.video.videoFormat'
>;

type WithLastValues<S extends {}, K extends keyof S & string> = {
  [O in keyof S]: O extends K ? S[O] | LastValue : S[O];
} & {
  [L in `last.${K}`]: L extends `last.${infer E}`
    ? E extends K
      ? S[E]
      : never
    : never;
};

export type SettingsLastValueKeys = Exclude<
  {
    [K in keyof Settings]: K extends `last.${string}` ? K : never;
  }[keyof Settings],
  undefined
>;

export type SettingsWithLastValueKeys = Exclude<
  {
    [K in keyof Settings]: `last.${K}` extends keyof Settings ? K : never;
  }[keyof Settings],
  undefined
>;

export type SettingsWithoutLastValueKeys = Exclude<
  SettingsOriginalKeys,
  SettingsWithLastValueKeys
>;

export type SettingsOriginalKeys = Omit<keyof Settings, SettingsLastValueKeys>;

export type SettingsLastValue<T extends keyof Settings> =
  `last.${T}` extends keyof Settings ? `last.${T}` : never;
