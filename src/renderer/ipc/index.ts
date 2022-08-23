import { typedIpcRenderer } from '@utils/ipc';

export function setupRendererIpc() {
  typedIpcRenderer.on({ channel: 'ytdl' }, async (msg) => {});
}
