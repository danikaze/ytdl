import { AppScreen } from '@interfaces/app';
import { Download } from '@interfaces/download';
import { Settings } from '@interfaces/settings';
import { typedIpcRenderer } from '@utils/ipc';
import type { AppUiApi } from '@renderer/jotai/ui';

interface Options {
  setScreen: (screen: AppScreen) => void;
  setSettings: (settings: Settings) => void;
  initDownloads: (downloads: readonly Download[]) => void;
  ui: AppUiApi;
}

export function setupRendererIpc({
  setScreen,
  setSettings,
  initDownloads,
  ui,
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

    if (typedIpcRenderer.is(msg, 'confirmDownloadRemoval')) {
      ui.setConfirmDownloadId(msg.data.id);
    }
  });
}
