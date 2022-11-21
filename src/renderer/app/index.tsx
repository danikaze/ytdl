import { ThemeProvider } from 'evergreen-ui';
import { useEffect } from 'react';
import { lightTheme } from '@renderer/themes/light';
import { setThemeGlobals } from '@renderer/themes';
import { useAppScreen } from '@renderer/jotai/app-screen';
import { useDownloads } from '@renderer/jotai/downloads';
import { useSettings } from '@renderer/jotai/settings';

import { DownloadScreen } from './screens/download';
import { SettingsScreen } from './screens/settings';
import { LoadingScreen } from './screens/loading';

import './app.module.scss';

export function App(): JSX.Element {
  const { screen, setScreen } = useAppScreen();
  const { setSettings } = useSettings();
  const { initDownloads } = useDownloads();
  const theme = lightTheme;

  useEffect(() => {
    window.ytdl.setupIpc({ setScreen, setSettings, initDownloads });
  }, [setScreen, setSettings, initDownloads]);

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
