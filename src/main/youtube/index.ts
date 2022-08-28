import { spawn } from 'child_process';
import { rename } from 'fs';
import { basename, dirname, join } from 'path';
import { sync as mkdirpSync } from 'mkdirp';
import { parseDownload } from './parser/download';
import { YoutubeDlAudioOptions, YoutubeDlOptions } from './types';
import { mainSettings } from '../settings';
import { parseDestination } from './parser/destination';

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
    onComplete: options.onComplete,
    onError: options.onError,
    onProgress: options.onProgress,
  });
}

function youtubeDownload({
  args,
  outputFolder,
  outputFile,
  onProgress,
  onError,
  onComplete,
}: YoutubeDlOptions) {
  const exePath = getExePath('2021.12.17');
  // console.log(`${basename(exePath)} ${args.join(' ')}`);
  try {
    if (args.includes('-o')) {
      throw new Error(
        'Do not use -o args, but use outputFolder and outputFile instead'
      );
    }

    const temporalFolder =
      mainSettings.get('useTemporalFolder') &&
      mainSettings.get('temporalFolder');
    const outputArg = join(
      temporalFolder || outputFolder,
      `${outputFile}.%(ext)s`
    );
    let downloadDestination: string;

    const exeArgs = ['-o', outputArg, ...args];
    console.log('ytdl:', {
      useTemporalFolder: mainSettings.get('useTemporalFolder'),
      temporalFolder: mainSettings.get('temporalFolder'),
      downloadOutputPath: outputArg,
      exeArgs,
    });
    const child = spawn(exePath, exeArgs);

    child.stdout.on('data', (data) => {
      console.log(String(data));
      const destination = parseDestination(data);
      if (destination) {
        downloadDestination = destination;
      }
      if (onProgress) {
        const progress = parseDownload(data);
        if (progress) onProgress(progress);
      }
    });

    child.stderr.on('data', (data) => {
      console.log(`yt [error]: ${data}`);
      onError?.(data);
    });

    child.on('close', (code) => {
      if (temporalFolder) {
        const finalOutputPath = join(
          outputFolder,
          basename(downloadDestination)
        );
        console.log(
          `Moving file from "${downloadDestination}" to ${finalOutputPath}`
        );
        try {
          mkdirpSync(dirname(finalOutputPath));
          rename(downloadDestination, finalOutputPath, (err) => {
            if (err) {
              onError?.(err.message);
            }
            onComplete?.(code);
          });
        } catch (e) {
          onError?.(String(e));
        }
        return;
      }

      console.log('complete', code);
      onComplete?.(code);
    });
  } catch (e) {
    onError?.(String(e));
    console.error(e);
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
