import { Catalogue } from '../../catalogue';
import { Download, DownloadState } from '../../../interfaces/download';
import { processAudio } from '../../../utils/audio';
import { ipcToWindow } from '../../../utils/ipc';
import { IpcCommands } from '../../../utils/ipc/commands';
import { downloadAudio } from '../../../utils/youtube/download-audio';
import { downloadVideo } from '../../../utils/youtube/download-video';
import {
  YoutubeDlAudioOptions,
  YoutubeDlReturn,
  YoutubeDlStateUpdate,
  YoutubeDlVideoOptions,
} from '../../../utils/youtube/types';

export async function downloadAudioOrVideo<
  T extends 'downloadAudio' | 'downloadVideo'
>(
  youtubeDownloads: Map<Download['id'], YoutubeDlReturn>,
  type: T,
  catalogue: Catalogue,
  data: Parameters<IpcCommands[T]>[0],
  downloadId?: Download['id']
): Promise<void> {
  const id =
    downloadId ||
    catalogue.addDownload({
      type: type === 'downloadAudio' ? 'audio' : 'video',
      url: data.url,
      postProcess: data.postProcess || {},
      format: data.format,
    });
  const ytdlUpdate = getYtdlUpdate(catalogue);

  const options: YoutubeDlAudioOptions | YoutubeDlVideoOptions = {
    outputFolder: data.outputFolder,
    outputFile: data.outputFile,
    format: data.format,
    onStart: async ({ temporalFile }) => {
      catalogue.updateDownload({ id, temporalFile });
      ipcToWindow('main', 'ytdlStart', catalogue.getDownload(id)!);
    },
    onComplete: async (exitCode, downloadPath) => {
      if (exitCode) {
        ytdlUpdate({
          id,
          state: DownloadState.ERRORED,
          speed: null,
          eta: null,
        });
        return;
      }

      if (isAudio(type, data)) {
        if (data.format === 'mp3' && data.postProcess?.audio) {
          ytdlUpdate({ id, state: DownloadState.PROCESSING });
          try {
            await processAudio(downloadPath, data.postProcess.audio);
          } catch (rawError) {
            const error = `Error while processing audio ${(
              rawError as Error
            ).toString()}`;
            ytdlUpdate({ id, error });
          }
        }
      }

      ytdlUpdate({
        id,
        state: DownloadState.COMPLETED,
        downloadPctg: 100,
        speed: null,
        eta: null,
      });
    },
    onUpdate: (update) => {
      ytdlUpdate({
        id,
        state: DownloadState.DOWNLOADING,
        ...update,
        ...((update as YoutubeDlStateUpdate).state === DownloadState.PAUSED
          ? {
              speed: null,
              eta: null,
            }
          : undefined),
      });
    },
    onError: (error) => {
      ytdlUpdate({
        id,
        error,
        state: DownloadState.ERRORED,
        speed: null,
        eta: null,
      });
    },
  };

  const dl = isAudio(type, data)
    ? downloadAudio(data.url, options as YoutubeDlAudioOptions)
    : downloadVideo(data.url, options as YoutubeDlVideoOptions);

  if (dl) {
    youtubeDownloads.set(id, dl);
  }
}

export function stopDownload(
  youtubeDownloads: Map<Download['id'], YoutubeDlReturn>,
  catalogue: Catalogue,
  id: Download['id']
): void {
  catalogue.updateDownload({ id, state: DownloadState.PAUSED });

  const dl = youtubeDownloads.get(id);
  if (dl) {
    dl.stop();
    youtubeDownloads.delete(id);
  }
}

function getYtdlUpdate(catalogue: Catalogue) {
  return (
    data: Pick<Download, 'id'> & Nullable<Partial<Omit<Download, 'id'>>>
  ) => {
    catalogue.updateDownload(data);
    ipcToWindow('main', 'ytdlUpdate', data);
  };
}

function isAudio(
  type: 'downloadAudio' | 'downloadVideo',
  data: Parameters<IpcCommands['downloadAudio' | 'downloadVideo']>[0]
): data is Parameters<IpcCommands['downloadAudio']>[0] {
  return type === 'downloadAudio';
}
