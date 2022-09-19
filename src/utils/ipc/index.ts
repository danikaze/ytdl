import type { WindowIds } from '@interfaces/app';
import type { IpcMessagesData } from './msgs';
import { TypedIpcMain } from './private/main';
import { TypedIpcRenderer } from './private/renderer';

export type IpcChannel = 'ytdl';

export const typedIpcMain = new TypedIpcMain<
  WindowIds,
  IpcChannel,
  IpcMessagesData
>();
export const typedIpcRenderer = new TypedIpcRenderer<
  IpcChannel,
  IpcMessagesData
>();
