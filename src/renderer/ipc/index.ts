import { AppScreen } from '@interfaces/app';
import { Settings } from '@interfaces/settings';
import type { useDownloads } from '@renderer/jotai/downloads';
import { typedIpcRenderer } from '@utils/ipc';
import type { AppUiApi } from '@renderer/jotai/ui';

interface Options {
  setScreen: (screen: AppScreen) => void;
  setSettings: (settings: Settings) => void;
  downloads: ReturnType<typeof useDownloads>;
  ui: AppUiApi;
}

export function setupRendererIpc({
  setScreen,
  setSettings,
  downloads,
  ui,
}: Options) {
  typedIpcRenderer.removeAllListeners('triggerIpcCommand');
  typedIpcRenderer.on('triggerIpcCommand', (ev, { command, args }) => {
    typedIpcRenderer.invoke(command, ...args);
  });

  typedIpcRenderer.removeAllListeners('triggerIpcEvent');
  typedIpcRenderer.on('triggerIpcEvent', (ev, { event, args }) => {
    typedIpcRenderer.send(event, ...args);
  });

  typedIpcRenderer.removeAllListeners('confirmDownloadRemoval');
  typedIpcRenderer.on('confirmDownloadRemoval', (ev, id) => {
    ui.setConfirmDownloadId(id);
  });

  typedIpcRenderer.removeAllListeners('changeScreen');
  typedIpcRenderer.on('changeScreen', (ev, screen) => {
    setScreen(screen);
  });

  typedIpcRenderer.removeAllListeners('initApp');
  typedIpcRenderer.on('initApp', (ev, data) => {
    setSettings(data.settings);
    downloads.initDownloads(data.downloads);
    setScreen('downloads');
  });

  typedIpcRenderer.removeAllListeners('ytdlStart');
  typedIpcRenderer.on('ytdlStart', (ev, data) => {
    downloads.addDownload(data);
  });

  typedIpcRenderer.removeAllListeners('ytdlUpdate');
  typedIpcRenderer.on('ytdlUpdate', (ev, data) => {
    downloads.updateDownload(data.id, data);
  });
}
