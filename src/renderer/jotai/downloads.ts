import { atom, useAtom } from 'jotai';
import { nanoid } from 'nanoid';
import {
  Download,
  DownloadPostProcessOptions,
  DownloadState,
} from '@interfaces/download';
import {
  isProgressUpdate,
  isStateUpdate,
  YoutubeDlAudioOptions,
  YoutubeDlVideoOptions,
} from '@utils/youtube/types';

const rawDownloads = atom<Download[]>([]);

type DownloadCallbackList = 'onUpdate' | 'onError' | 'onComplete';
type DownloadCallbacks = Pick<YoutubeDlVideoOptions, DownloadCallbackList>;
type DownloadAudioOptions = Omit<
  YoutubeDlAudioOptions,
  DownloadCallbackList
> & { postProcess?: DownloadPostProcessOptions };
type DownloadVideoOptions = Omit<YoutubeDlVideoOptions, DownloadCallbackList>;

export function useDownloads() {
  const [downloads, setDownloads] = useAtom(rawDownloads);

  function addDownload(
    download: Omit<Download, 'id' | 'state' | 'temporalFile' | 'downloadPctg'>
  ) {
    const id = nanoid();

    setDownloads((dls) => {
      const temporalFile = '';

      const dl = {
        id,
        temporalFile,
        state: DownloadState.INITIALIZATING,
        downloadPctg: 0,
        ...download,
      };

      return [...dls, dl];
    });

    return id;
  }

  function updateDownload(
    id: string,
    value: Partial<Nullable<Omit<Download, 'id'>>>
  ) {
    setDownloads((dls) => {
      const item = dls.find((dl) => dl.id === id);
      if (!item) return dls;
      Object.assign(item, value);
      return [...dls];
    });
  }

  function getDownloadCallbacks(id: string): DownloadCallbacks {
    return {
      onUpdate: (update) => {
        // console.log('[onUpdate]', update);
        if (isStateUpdate(update)) {
          updateDownload(id, {
            state: update.state,
          });
        } else if (isProgressUpdate(update)) {
          updateDownload(id, {
            state: DownloadState.DOWNLOADING,
            downloadPctg: update.percentage,
            size: update.size,
            speed: update.speed,
            eta: update.eta,
          });
        }
      },
      onError: (error) => {
        // console.log('[onError]', error);
        updateDownload(id, {
          error,
          state: DownloadState.ERRORED,
          speed: undefined,
          eta: undefined,
        });
      },
      onComplete: (code) => {
        // console.log('[onComplete]');
        if (code) {
          updateDownload(id, {
            state: DownloadState.ERRORED,
            speed: undefined,
            eta: undefined,
          });
          return;
        }
        updateDownload(id, {
          state: DownloadState.COMPLETED,
          downloadPctg: 100,
          speed: undefined,
          eta: undefined,
        });
      },
    };
  }

  function addAudioDownload(url: string, options: DownloadAudioOptions) {
    const id = addDownload({ url, postProcess: options.postProcess || {} });
    window.ytdl.downloadAudio(url, {
      ...options,
      ...getDownloadCallbacks(id),
    });
  }

  function addVideoDownload(url: string, options: DownloadVideoOptions) {
    const id = addDownload({ url, postProcess: {} });
    window.ytdl.downloadVideo(url, {
      ...options,
      ...getDownloadCallbacks(id),
    });
  }

  return {
    downloadList: downloads as Readonly<Download[]>,
    downloadAudio: addAudioDownload,
    downloadVideo: addVideoDownload,
  };
}
