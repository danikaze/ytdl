import { youtubeDownload } from './utils/download';
import { YoutubeDlReturn, YoutubeDlVideoOptions } from './types';

export function downloadVideo(
  url: string,
  options: YoutubeDlVideoOptions
): YoutubeDlReturn | undefined {
  const args = ['-f', options.format || 'best', url];

  return youtubeDownload({
    args,
    outputFolder: options.outputFolder,
    outputFile: options.outputFile,
    onStart: options.onStart,
    onComplete: options.onComplete,
    onError: options.onError,
    onUpdate: options.onUpdate,
  });
}
