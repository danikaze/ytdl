import { AppScreen } from '@interfaces/app';
import { Download } from '@interfaces/download';
import { Settings } from '@interfaces/settings';
import { typedIpcRenderer } from '@utils/ipc';

interface Options {
  setScreen: (screen: AppScreen) => void;
  setSettings: (settings: Settings) => void;
  initDownloads: (downloads: readonly Download[]) => void;
}

export function setupRendererIpc({
  setScreen,
  setSettings,
  initDownloads,
}: Options) {
  typedIpcRenderer.on({ channel: 'ytdl' }, async (msg) => {
    if (typedIpcRenderer.is(msg, 'changeScreen')) {
      setScreen('settings');
    }

    if (typedIpcRenderer.is(msg, 'initApp')) {
      setSettings(msg.data.settings);
      initDownloads(msg.data.downloads);
      setScreen('downloads');
    }
  });
}
