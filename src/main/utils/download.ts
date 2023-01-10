import { Download, DownloadState } from '../../interfaces/download';
import { processAudio } from '../../utils/audio';
import { IpcMessagesData } from '../../utils/ipc/msgs';
import { IpcMainIncomingMessage } from '../../utils/ipc/private/main-message';
import { downloadAudio } from '../../utils/youtube/download-audio';
import { downloadVideo } from '../../utils/youtube/download-video';
import {
  YoutubeDlAudioOptions,
  YoutubeDlVideoOptions,
  YoutubeDlStateUpdate,
  YoutubeDlReturn,
} from '../../utils/youtube/types';
import { Catalogue } from '../catalogue';

export interface StartDownloadOptions {
  id: Download['id'];
  catalogue: Catalogue;
  youtubeDownloads: Map<Download['id'], YoutubeDlReturn>;
  msg: IpcMainIncomingMessage<
    'main',
    'ytdl',
    IpcMessagesData,
    'downloadAudio' | 'downloadVideo' | 'resumeDownload'
  >;
}

type StartDownloadData =
  | IpcMessagesData['downloadAudio']
  | IpcMessagesData['downloadVideo'];

export function startDownload(
  { id, catalogue, youtubeDownloads, msg }: StartDownloadOptions,
  data: StartDownloadData
) {
  const ytdlUpdate = getYtdlUpdate(catalogue, msg);

  const options: YoutubeDlAudioOptions | YoutubeDlVideoOptions = {
    outputFolder: data.outputFolder,
    outputFile: data.outputFile,
    format: data.format,
    onStart: async ({ temporalFile }) => {
      catalogue.updateDownload({ id, temporalFile });
      msg.reply('ytdlStart', catalogue.getDownload(id)!);
    },
    onComplete: async (exitCode, downloadPath) => {
      youtubeDownloads.delete(id);
      if (exitCode) {
        ytdlUpdate({
          id,
          state: DownloadState.ERRORED,
          speed: null,
          eta: null,
        });
        return;
      }

      if (isDownloadAudio(data)) {
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
      msg.end();
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

  const dl = isDownloadAudio(data)
    ? downloadAudio(data.url, options as YoutubeDlAudioOptions)
    : downloadVideo(data.url, options as YoutubeDlVideoOptions);
  if (dl) {
    youtubeDownloads.set(id, dl);
  }
}

function isDownloadAudio(
  data: StartDownloadData
): data is IpcMessagesData['downloadAudio'] {
  return (
    (data as IpcMessagesData['downloadAudio']).postProcess?.audio !== undefined
  );
}

function getYtdlUpdate(catalogue: Catalogue, msg: StartDownloadOptions['msg']) {
  return (
    data: Pick<Download, 'id'> & Nullable<Partial<Omit<Download, 'id'>>>
  ) => {
    catalogue.updateDownload(data);
    msg.reply('ytdlUpdate', data);
  };
}
