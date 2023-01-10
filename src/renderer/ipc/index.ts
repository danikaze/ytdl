import { AppScreen } from '@interfaces/app';
import { Download } from '@interfaces/download';
import { Settings } from '@interfaces/settings';
import { typedIpcRenderer } from '@utils/ipc';
import type { AppUiApi } from '@renderer/jotai/ui';

interface Options {
  setScreen: (screen: AppScreen) => void;
  setSettings: (settings: Settings) => void;
  initDownloads: (downloads: readonly Download[]) => void;
  updateDownload: (
    id: Download['id'],
    value: Partial<DeepNullable<Omit<Download, 'id'>>>
  ) => void;
  ui: AppUiApi;
}

export function setupRendererIpc({
  setScreen,
  setSettings,
  initDownloads,
  updateDownload,
  ui,
}: Options) {
  typedIpcRenderer.on({ channel: 'ytdl' }, async (msg) => {
    if (typedIpcRenderer.is(msg, 'requestIpcMsg')) {
      const reply = typedIpcRenderer.createMessage(
        'ytdl',
        msg.data.type,
        msg.data.data
      );
      reply.send();
      reply.end();
    }

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

    if (typedIpcRenderer.is(msg, 'ytdlUpdate')) {
      updateDownload(msg.data.id, msg.data);
    }
  });
}
