import { atom, useAtom } from 'jotai';
import { nanoid } from 'nanoid';
import { Download, DownloadState } from 'src/interfaces/download';

const rawDownloads = atom<Download[]>([]);

export function useDownloads() {
  const [downloads, setDownloads] = useAtom(rawDownloads);

  function addDownload(
    download: Omit<Download, 'id' | 'state' | 'temporalFile'>
  ) {
    const id = nanoid();
    const temporalFile = '';

    downloads.push({
      id,
      temporalFile,
      state: DownloadState.INITIALIZATING,
      ...download,
    });
    setDownloads([...downloads]);

    return id;
  }

  function updateDownload(
    id: string,
    value: Partial<Nullable<Omit<Download, 'id'>>>
  ) {
    const item = downloads.find((dl) => dl.id === id);
    if (!item) return;
    Object.assign(item, value);
    setDownloads([...downloads]);
  }

  return {
    list: downloads as Readonly<Download[]>,
    add: addDownload,
    update: updateDownload,
  };
}
