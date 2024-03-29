import {
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron';
import type { Catalogue } from '../catalogue';
import { addDevContextMenuOptions } from './dev';
import {
  createDownloadItemContextMenu,
  DownloadItemContextMenuData,
  isDownloadItemContext,
} from './download-item';

export type ContextMenuContext = {
  window: BrowserWindow;
  x: number;
  y: number;
};

export type ContextMenuTemplate = (MenuItemConstructorOptions | MenuItem)[];

export type ContextMenuData = {} | DownloadItemContextMenuData;

/**
 * Factory function to create context menus in the application
 */
export function openContextMenu(
  catalogue: Catalogue,
  context: ContextMenuContext,
  data: ContextMenuData
): void {
  const template: ContextMenuTemplate = isDownloadItemContext(data)
    ? createDownloadItemContextMenu(catalogue, data)
    : [];

  addDevContextMenuOptions(context, template);

  if (!template.length) return;

  Menu.buildFromTemplate(template).popup({ window: context.window });
}
