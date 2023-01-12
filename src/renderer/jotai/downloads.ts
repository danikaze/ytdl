import { atom, useAtom } from 'jotai';
import { Download } from '@interfaces/download';
import { assignDeepWithDelete } from '@utils/assign-deep';
import { removeFromArrayAndCopy } from '@utils/remove-from-array';

const rawDownloads = atom<Download[]>([]);

export function useDownloads() {
  const [downloads, setDownloads] = useAtom(rawDownloads);

  function initDownloads(downloadList: readonly Download[]) {
    setDownloads([...downloadList]);
  }

  function addDownload(download: Download) {
    setDownloads((dls) => {
      if (dls.find((d) => d.id === download.id)) return dls;
      return [...dls, download];
    });
  }

  function updateDownload(
    id: Download['id'],
    value: Partial<DeepNullable<Omit<Download, 'id'>>>
  ) {
    setDownloads((dls) => {
      const item = dls.find((dl) => dl.id === id);
      if (!item) return dls;
      assignDeepWithDelete(item, value);
      return [...dls];
    });
  }

  function removeDownload(id: Download['id'], removeData: boolean): void {
    setDownloads(removeFromArrayAndCopy(downloads, (d) => d.id === id));
    window.ytdl.removeDownload(id, removeData);
  }

  return {
    initDownloads,
    addDownload,
    updateDownload,
    removeDownload,
    downloadList: downloads as Readonly<Download[]>,
  };
}
