import { spawn } from 'child_process';
import { join } from 'path';
import { processDownloadData } from './process-download-data';
import { YoutubeDlAudioOptions, YoutubeDlOptions } from './types';

export function downloadAudio(
  url: string,
  options: YoutubeDlAudioOptions = {}
) {
  const args = [
    '-o',
    '%(title)s.%(ext)s',
    '--extract-audio',
    '--audio-quality',
    '0',
    '--audio-format',
    options.format || 'mp3',
    url,
  ];

  youtubeDownload({
    args,
    onComplete: options.onComplete,
    onError: options.onError,
    onProgress: options.onProgress,
  });
}

function youtubeDownload({
  args,
  onProgress,
  onError,
  onComplete,
}: YoutubeDlOptions) {
  const exePath = getExePath('2021.12.17');
  // console.log(`${basename(exePath)} ${args.join(' ')}`);
  try {
    const child = spawn(exePath, args);
    child.stdout.on('data', (data) => {
      // console.log(String(data));
      if (onProgress) {
        const progress = processDownloadData(data);
        if (progress) onProgress(progress);
      }
    });
    child.stderr.on('data', (data) => {
      // console.log(`yt [error]: ${data}`);
      onError?.(data);
    });
    child.on('close', (code) => {
      // console.log('complete', code);
      onComplete?.(code);
    });
  } catch (e) {
    onError?.(String(e));
    // console.error(e);
  }
}

function getExePath(version: string): string {
  const VERSION = '{{VERSION}}';
  const filename = `youtube-dl-${VERSION}.exe`;
  const folder =
    process.env.NODE_ENV === 'development'
      ? 'assets/bin'
      : 'resources/assets/bin';

  return join(folder, filename).replace(VERSION, version);
}
