/* eslint-disable @typescript-eslint/naming-convention */
import { defaultTheme } from 'evergreen-ui';
import { createTheme } from '.';

export const lightTheme = createTheme({
  roles: {
    linkColor: defaultTheme.colors.blue400,
    linkColorHover: defaultTheme.colors.blue600,
  },
  components: {
    ProgressBar: {
      borderRadius: defaultTheme.radii[1],
      barPending: defaultTheme.colors.blue200,
      barCompleted: defaultTheme.colors.blue600,
      text: defaultTheme.colors.white,
    },
  },
});
