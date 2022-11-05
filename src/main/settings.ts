import { LAST_VALUE } from '../interfaces/settings';
import { THUMB_MAX_BYTES_DEFAULT } from '../utils/constants';
import { MainSettings } from './utils/settings';

export const mainSettings = new MainSettings({
  defaultValues: {
    // app
    'app.youtubeDlVersion': '2021.12.17',
    // downloads
    'downloads.downloadFolder': LAST_VALUE,
    'downloads.useTemporalFolder': false,
    'downloads.temporalFolder': './temp',
    'downloads.downloadType': LAST_VALUE,
    'downloads.audio.audioFormat': LAST_VALUE,
    'downloads.audio.metadata.image': {
      resize: {
        type: 'cover',
        crop: true,
        width: 500,
        height: 500,
      },
      maxBytes: THUMB_MAX_BYTES_DEFAULT,
    },
    'downloads.video.videoFormat': LAST_VALUE,
    // latest used values
    'last.downloads.downloadFolder': './downloads',
    'last.downloads.downloadType': 'audio',
    'last.downloads.audio.audioFormat': 'best',
    'last.downloads.video.videoFormat': 'best',
  },
});
