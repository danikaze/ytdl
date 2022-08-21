import { Provider } from 'jotai';
import { DownloadList } from '@renderer/components/download-list';
import { YoutubeInput } from '@renderer/components/yt-input';
import { useDownloads } from '@renderer/jotai/downloads';

export function DownloadScreen() {
  const downloads = useDownloads();

  const urlInputHandler = (url: string) => {
    console.log('URL', url);
    const id = downloads.add({ url, dowloadPctg: 0 });
    window.ytdl.downloadAudio(url, {
      onProgress: (progress) => {
        console.log('progress', progress);
        downloads.update(id, { dowloadPctg: progress.percentage });
      },
      onError: (error) => console.log('error', error),
      onComplete: () => console.log('completed'),
    });
  };

  return (
    <Provider>
      <div>
        <YoutubeInput onInput={urlInputHandler} />
        <DownloadList downloads={downloads.list} />
      </div>
    </Provider>
  );
}
