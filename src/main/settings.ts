import { MainSettings } from './utils/settings';

export const mainSettings = new MainSettings({
  defaultValues: {
    youtubeDlVersion: '2021.12.17',
    downloadFolder: './downloads',
    useTemporalFolder: false,
    temporalFolder: './temp',
  },
});
