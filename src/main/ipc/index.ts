import { basename, dirname } from 'path';
import { BrowserWindow, dialog } from 'electron';
import { withoutExtension } from '../../utils/without-extension';
import type { YoutubeDlReturn } from '../../utils/youtube/types';
import { Download } from '../../interfaces/download';
import { openContextMenu } from '../context-menu';
import type { Settings } from '../../interfaces/settings';
import { fetchMetadata } from '../../utils/youtube/fetch-metadata';
import { typedIpcMain } from '../../utils/ipc';
import { mainSettings } from '../settings';
import { Catalogue } from '../catalogue';
import { downloadAudioOrVideo, stopDownload } from './handlers/download';
import { prepareImageHandler } from './handlers/prepare-image';

export type IpcMsg<T extends string, D extends {} = {}> = {
  id: number;
  type: T;
} & D;

const youtubeDownloads = new Map<Download['id'], YoutubeDlReturn>();

export function setupMainIpc(catalogue: Catalogue) {
  typedIpcMain.handle('openContextMenu', (ev, data) => {
    const { x, y, ...contextMenuData } = data;
    openContextMenu(
      catalogue,
      {
        window: BrowserWindow.fromWebContents(ev.sender)!,
        x,
        y,
      },
      contextMenuData
    );
  });

  typedIpcMain.handle('downloadAudio', (ev, data) =>
    downloadAudioOrVideo(youtubeDownloads, 'downloadAudio', catalogue, data)
  );
  typedIpcMain.handle('downloadVideo', (ev, data) =>
    downloadAudioOrVideo(youtubeDownloads, 'downloadVideo', catalogue, data)
  );

  typedIpcMain.handle('fetchMetadata', async (ev, url) => {
    try {
      return await fetchMetadata(url);
    } catch (error) {
      return String(error);
    }
  });

  typedIpcMain.handle('pickPath', async (ev, options) => {
    const window = BrowserWindow.fromWebContents(ev.sender)!;
    const pickResult = await dialog.showOpenDialog(window, options);
    return !pickResult.canceled && pickResult.filePaths;
  });

  typedIpcMain.handle('updateSettings', (ev, data) => {
    Object.entries(data).forEach(([key, value]) => {
      mainSettings.set(key as keyof Settings, value);
    });
    mainSettings.save();
  });

  typedIpcMain.handle('prepareImage', (ev, data) =>
    prepareImageHandler(mainSettings, data)
  );

  typedIpcMain.handle('resumeDownload', (ev, id) => {
    const dl = catalogue.getDownload(id);
    if (!dl) {
      console.log(`Tried to resume a non existing download (id: ${id})`);
      return;
    }
    downloadAudioOrVideo(
      youtubeDownloads,
      dl.type === 'audio' ? 'downloadAudio' : 'downloadVideo',
      catalogue,
      {
        url: dl.url,
        outputFolder: dirname(dl.outputFile || dl.temporalFile),
        outputFile: withoutExtension(
          basename(dl.outputFile || dl.temporalFile)
        ),
        format: dl.format,
        postProcess: dl.postProcess,
      },
      id
    );
  });

  typedIpcMain.handle('stopDownload', (ev, id) =>
    stopDownload(youtubeDownloads, catalogue, id)
  );

  typedIpcMain.handle('removeDownload', (ev, id, removeData) => {
    catalogue.removeDownload(id, removeData);

    const dl = youtubeDownloads.get(id);
    if (dl) {
      dl.stop();
      youtubeDownloads.delete(id);
    }
  });
}
