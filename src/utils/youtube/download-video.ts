import { YoutubeDlVideoOptions } from './types';
import { youtubeDownload } from './utils/download';

export function downloadVideo(url: string, options: YoutubeDlVideoOptions) {
  const args = ['-f', options.format || 'best', url];

  youtubeDownload({
    args,
    outputFolder: options.outputFolder,
    outputFile: options.outputFile,
    onComplete: options.onComplete,
    onError: options.onError,
    onUpdate: options.onUpdate,
  });
}
