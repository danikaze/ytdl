import { YoutubeDlAudioOptions } from './types';
import { youtubeDownload } from './utils/download';

export function downloadAudio(url: string, options: YoutubeDlAudioOptions) {
  const args = [
    '--extract-audio',
    '--audio-quality',
    '0',
    '--audio-format',
    options.format || 'mp3',
    url,
  ];

  youtubeDownload({
    args,
    outputFolder: options.outputFolder,
    outputFile: options.outputFile,
    onStart: options.onStart,
    onComplete: options.onComplete,
    onError: options.onError,
    onUpdate: options.onUpdate,
  });
}
