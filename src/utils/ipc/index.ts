import { BrowserWindow, ipcMain, ipcRenderer, WebContents } from 'electron';
import type { TypedIpcMain, TypedIpcRenderer } from 'electron-typed-ipc';
import type { IpcCommands } from './commands';
import type { IpcEvents } from './events';

type WindowId = 'main';

const registeredTargets = new Map<WindowId, WebContents>();

export const typedIpcMain = ipcMain as TypedIpcMain<IpcEvents, IpcCommands>;
export const typedIpcRenderer = ipcRenderer as TypedIpcRenderer<
  IpcEvents,
  IpcCommands
>;

export function registerIpcTarget(id: WindowId, window: BrowserWindow): void {
  registeredTargets.set(id, window.webContents);
}

export function ipcToWindow<K extends keyof IpcEvents>(
  window: WindowId | WebContents,
  channel: K,
  ...args: Parameters<IpcEvents[K]>
): void {
  const target =
    typeof window === 'string' ? registeredTargets.get(window) : window;

  if (!target) {
    throw new Error(`The window "${window}" hasn't been registered yet`);
  }

  target.send(channel, ...args);
}
