/* eslint-disable @typescript-eslint/naming-convention */
import { DownloadState } from '@interfaces/download';
import { defaultTheme } from 'evergreen-ui';
import { createTheme } from '.';

export const lightTheme = createTheme({
  roles: {
    linkColor: defaultTheme.colors.blue400,
    linkColorHover: defaultTheme.colors.blue600,
  },
  components: {
    DownloadState: {
      [DownloadState.INITIALIZATING]: defaultTheme.colors.blue300,
      [DownloadState.DOWNLOADING_WEBPAGE]: defaultTheme.colors.blue500,
      [DownloadState.DOWNLOADING]: defaultTheme.colors.green500,
      [DownloadState.PROCESSING]: defaultTheme.colors.teal100,
      [DownloadState.STORING]: defaultTheme.colors.teal100,
      [DownloadState.COMPLETED]: defaultTheme.colors.green500,
      [DownloadState.ERRORED]: defaultTheme.colors.red500,
      [DownloadState.PAUSED]: defaultTheme.colors.gray500,
    },
    ProgressBar: {
      borderRadius: defaultTheme.radii[1],
      barPending: defaultTheme.colors.blue100,
      barCompleted: defaultTheme.colors.blue500,
      text: defaultTheme.colors.white,
    },
  },
});
