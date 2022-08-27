import { DownloadList } from '@renderer/components/download-list';
import { YoutubeInput } from '@renderer/components/yt-input';
import { useDownloads } from '@renderer/jotai/downloads';
import { DownloadState } from '@interfaces/download';

export function DownloadScreen() {
  const downloads = useDownloads();

  const urlInputHandler = (url: string) => {
    const id = downloads.add({
      url,
      downloadPctg: 0,
    });
    window.ytdl.downloadAudio(url, {
      onProgress: (progress) => {
        // console.log('progress', progress);
        downloads.update(id, {
          state: DownloadState.DOWNLOADING,
          downloadPctg: progress.percentage,
          size: progress.size,
          speed: progress.speed,
          eta: progress.eta,
        });
      },
      onError: (error) => {
        // console.log('error', error);
        downloads.update(id, {
          state: DownloadState.ERRORED,
          speed: undefined,
          eta: undefined,
        });
      },
      onComplete: () => {
        // console.log('completed');
        downloads.update(id, {
          state: DownloadState.COMPLETED,
          downloadPctg: 100,
          speed: undefined,
          eta: undefined,
        });
      },
    });
  };

  return (
    <div>
      <YoutubeInput onInput={urlInputHandler} />
      <DownloadList downloads={downloads.list} />
    </div>
  );
}
