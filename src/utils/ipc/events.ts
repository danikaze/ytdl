import type { AppScreen } from '@interfaces/app';
import { Download } from '@interfaces/download';
import { Settings } from '@interfaces/settings';
import { IpcCommands } from './commands';

/**
 * Definition of available IPC Events
 *
 * Used via `send*`/`on*`
 */
export type IpcEvents = {
  triggerIpcEvent: <
    E extends Exclude<keyof IpcEvents, 'triggerIpcEvent' | 'triggerIpcCommand'>
  >(data: {
    event: E;
    args: Parameters<IpcEvents[E]>;
  }) => void;
  triggerIpcCommand: <C extends keyof IpcCommands>(data: {
    command: C;
    args: Parameters<IpcCommands[C]>;
  }) => void;
  confirmDownloadRemoval: (id: Download['id']) => void;
  changeScreen: (screen: AppScreen) => void;
  ytdlStart: (data: Download) => void;
  ytdlUpdate: (
    data: Pick<Download, 'id'> & Nullable<Partial<Omit<Download, 'id'>>>
  ) => void;
  ytdlError: (error: string) => void;
  initApp: (data: { settings: Settings; downloads: Download[] }) => void;
};
