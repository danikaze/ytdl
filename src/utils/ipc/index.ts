import type { WindowIds } from '@interfaces/app';
import type { IpcMessagesData } from './msgs';
import { TypedIpcMain } from './private/main';
import { TypedIpcRenderer } from './private/renderer';

export type IpcChannel = 'ytdl';

export interface TypedIpcOptions {
  log?: boolean;
}

export const typedIpcMain = new TypedIpcMain<
  WindowIds,
  IpcChannel,
  IpcMessagesData
>({ log: true });
export const typedIpcRenderer = new TypedIpcRenderer<
  IpcChannel,
  IpcMessagesData
>({ log: true });
