import { LAST_VALUE } from '../interfaces/settings';
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
    'downloads.video.videoFormat': LAST_VALUE,
    // latest used values
    'last.downloads.downloadFolder': './downloads',
    'last.downloads.downloadType': 'audio',
    'last.downloads.audio.audioFormat': 'best',
    'last.downloads.video.videoFormat': 'best',
  },
});
