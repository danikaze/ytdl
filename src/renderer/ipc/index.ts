import { AppScreen } from '@interfaces/app';
import { typedIpcRenderer } from '@utils/ipc';

interface Options {
  setScreen: (screen: AppScreen) => void;
}

export function setupRendererIpc({ setScreen }: Options) {
  typedIpcRenderer.on({ channel: 'ytdl' }, async (msg) => {
    console.log('Ipc', msg);

    if (typedIpcRenderer.is(msg, 'changeScreen')) {
      setScreen('settings');
    }
  });
}
