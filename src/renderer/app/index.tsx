import { ThemeProvider } from 'evergreen-ui';
import { useEffect } from 'react';
import { lightTheme } from '@renderer/themes/light';
import { setThemeGlobals } from '@renderer/themes';
import { useAppScreen } from '@renderer/jotai/app-screen';
import { useDownloads } from '@renderer/jotai/downloads';
import { useSettings } from '@renderer/jotai/settings';
import { getContextMenuOpener } from '@renderer/utils/open-context-menu';
import { useAppUi } from '@renderer/jotai/ui';

import { DownloadScreen } from './screens/download';
import { SettingsScreen } from './screens/settings';
import { LoadingScreen } from './screens/loading';

import './app.module.scss';

export function App(): JSX.Element {
  const { screen, setScreen } = useAppScreen();
  const ui = useAppUi();
  const { setSettings } = useSettings();
  const downloads = useDownloads();
  const theme = lightTheme;

  useEffect(() => {
    const handler = getContextMenuOpener();
    window.addEventListener('contextmenu', handler);
    return () => window.removeEventListener('contextmenu', handler);
  }, []);

  useEffect(() => {
    window.ytdl.setupRendererIpc({ setScreen, setSettings, downloads, ui });
  }, [setScreen, setSettings, downloads, ui]);

  useEffect(() => {
    setThemeGlobals(theme);
  }, [theme]);

  let page;

  if (screen === 'loading') {
    page = <LoadingScreen />;
  } else if (screen === 'downloads') {
    page = <DownloadScreen />;
  } else if (screen === 'settings') {
    page = <SettingsScreen />;
  }

  return <ThemeProvider value={theme}>{page}</ThemeProvider>;
}
