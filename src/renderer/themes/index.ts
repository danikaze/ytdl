/* eslint-disable @typescript-eslint/naming-convention */
import {
  Color,
  defaultTheme,
  DefaultTheme,
  mergeTheme,
  useTheme,
} from 'evergreen-ui';

export interface YtdlTheme extends DefaultTheme {
  roles: {
    linkColor: Color;
    linkColorHover: Color;
  };
  components: DefaultTheme['components'] & {
    ProgressBar: {
      borderRadius: string;
      barPending: Color;
      barCompleted: Color;
      text: Color;
    };
  };
}

export function useYtdlTheme() {
  return useTheme() as YtdlTheme;
}

export function createTheme(
  def: DeepPartial<YtdlTheme>,
  base = defaultTheme
): YtdlTheme {
  return mergeTheme(def as YtdlTheme, base);
}

export function setThemeGlobals(theme: YtdlTheme): void {
  if (typeof window === 'undefined') return;
  document.body.style.setProperty('--ytdl-link-color', theme.roles.linkColor);
  document.body.style.setProperty(
    '--ytdl-link-color-hover',
    theme.roles.linkColorHover
  );
}
