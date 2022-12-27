import { youtubeDownload } from './utils/download';
import { YoutubeDlAudioOptions, YoutubeDlReturn } from './types';

export function downloadAudio(
  url: string,
  options: YoutubeDlAudioOptions
): YoutubeDlReturn | undefined {
  const args = [
    '--extract-audio',
    '--audio-quality',
    '0',
    '--audio-format',
    options.format || 'mp3',
    url,
  ];

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
