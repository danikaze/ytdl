import { ThemeProvider } from 'evergreen-ui';
import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { lightTheme } from '@renderer/themes/light';
import { setThemeGlobals } from '@renderer/themes';

import { DownloadScreen } from './screens/download';

import './app.module.scss';

export default function App() {
  const theme = lightTheme;

  useEffect(() => {
    window.ytdl.setupIpc();
  }, []);

  useEffect(() => {
    setThemeGlobals(theme);
  }, [theme]);

  return (
    <ThemeProvider value={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<DownloadScreen />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
