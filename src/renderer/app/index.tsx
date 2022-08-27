import { ThemeProvider } from 'evergreen-ui';
import { useEffect } from 'react';
import { lightTheme } from '@renderer/themes/light';
import { setThemeGlobals } from '@renderer/themes';
import { useAppScreen } from '@renderer/jotai/app-screen';

import { DownloadScreen } from './screens/download';
import { SettingsScreen } from './screens/settings';

import './app.module.scss';

export function App(): JSX.Element {
  const { screen, setScreen } = useAppScreen();
  const theme = lightTheme;

  useEffect(() => {
    window.ytdl.setupIpc({ setScreen });
  }, [setScreen]);

  useEffect(() => {
    setThemeGlobals(theme);
  }, [theme]);

  let page;

  if (screen === 'downloads') {
    page = <DownloadScreen />;
  } else if (screen === 'settings') {
    page = <SettingsScreen />;
  }

  return <ThemeProvider value={theme}>{page}</ThemeProvider>;
}
