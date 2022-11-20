import { atom, useAtom } from 'jotai';
import { Download } from '@interfaces/download';
import { assignDeepWithDelete } from '@utils/assign-deep';
import {
  DownloadAudioOptions,
  DownloadOptions,
  DownloadVideoOptions,
} from '@main/preload';

const rawDownloads = atom<Download[]>([]);

export function useDownloads() {
  const [downloads, setDownloads] = useAtom(rawDownloads);

  function addDownload(download: Download) {
    setDownloads((dls) => [...dls, download]);
  }

  function updateDownload(
    id: string,
    value: Partial<DeepNullable<Omit<Download, 'id'>>>
  ) {
    setDownloads((dls) => {
      const item = dls.find((dl) => dl.id === id);
      if (!item) return dls;
      assignDeepWithDelete(item, value);
      return [...dls];
    });
  }

  function getDownloadCallbacks(): Pick<
    DownloadOptions,
    'onStart' | 'onUpdate'
  > {
    let id: Download['id'];
    return {
      onStart: (download) => {
        id = download.id!;
        addDownload(download as Download);
      },
      onUpdate: (update) => {
        // console.log('[onUpdate]', update);
        updateDownload(id, update);
      },
    };
  }

  function addAudioDownload(url: string, options: DownloadAudioOptions) {
    window.ytdl.downloadAudio(url, {
      ...options,
      ...getDownloadCallbacks(),
    });
  }

  function addVideoDownload(url: string, options: DownloadVideoOptions) {
    window.ytdl.downloadVideo(url, {
      ...options,
      ...getDownloadCallbacks(),
    });
  }

  return {
    downloadList: downloads as Readonly<Download[]>,
    downloadAudio: addAudioDownload,
    downloadVideo: addVideoDownload,
  };
}
