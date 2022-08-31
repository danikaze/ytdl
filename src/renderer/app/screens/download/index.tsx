import { DownloadList } from '@renderer/components/download-list';
import { YoutubeInput } from '@renderer/components/yt-input';
import { useDownloads } from '@renderer/jotai/downloads';
import { DownloadState } from '@interfaces/download';
import { useSettings } from '@renderer/jotai/settings';
import { isProgressUpdate, isStateUpdate } from '@utils/youtube/types';

export function DownloadScreen() {
  const { settings } = useSettings();
  const downloads = useDownloads();

  const urlInputHandler = (url: string) => {
    const id = downloads.add({
      url,
      downloadPctg: 0,
    });
    window.ytdl.downloadAudio(url, {
      outputFolder: settings.downloadFolder,
      outputFile: '%(title)s',
      onUpdate: (update) => {
        // console.log('progress', progress);
        if (isStateUpdate(update)) {
          downloads.update(id, {
            state: update.state,
          });
        } else if (isProgressUpdate(update)) {
          downloads.update(id, {
            state: DownloadState.DOWNLOADING,
            downloadPctg: update.percentage,
            size: update.size,
            speed: update.speed,
            eta: update.eta,
          });
        }
      },
      onError: (error) => {
        // console.log('error', error);
        downloads.update(id, {
          error,
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
