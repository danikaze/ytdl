import { AppScreen } from '@interfaces/app';
import { Settings } from '@interfaces/settings';
import { typedIpcRenderer } from '@utils/ipc';

interface Options {
  setScreen: (screen: AppScreen) => void;
  setSettings: (settings: Settings) => void;
}

export function setupRendererIpc({ setScreen, setSettings }: Options) {
  typedIpcRenderer.on({ channel: 'ytdl' }, async (msg) => {
    console.log('Ipc', msg);

    if (typedIpcRenderer.is(msg, 'changeScreen')) {
      setScreen('settings');
    }

    if (typedIpcRenderer.is(msg, 'initSettings')) {
      setSettings(msg.data);
      setScreen('downloads');
    }
  });
}
