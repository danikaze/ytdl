import { spawn } from 'child_process';
import { rename } from 'fs';
import { basename, dirname, join } from 'path';
import { sync as mkdirpSync } from 'mkdirp';
import { DownloadState } from '../../interfaces/download';
import { parseDownload } from './parser/download';
import {
  YoutubeDlAudioOptions,
  YoutubeDlOptions,
  YoutubeDlVideoOptions,
} from './types';
import { mainSettings } from '../../main/settings';
import { parseDestination } from './parser/destination';
import { parseDownloadWebsite } from './parser/download-website';
import { parseFfmpeg } from './parser/ffmpeg';

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
    onUpdate: options.onUpdate,
  });
}

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

function youtubeDownload({
  args,
  outputFolder,
  outputFile,
  onUpdate,
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
    const child = spawn(exePath, exeArgs);

    child.stdout.on('data', (dataBuffer) => {
      const data = String(dataBuffer);

      const destination = parseDestination(data);
      if (destination) {
        downloadDestination = destination;
      }
      if (!onUpdate) return;

      const webDl = parseDownloadWebsite(data);
      if (webDl) {
        onUpdate({ state: DownloadState.DOWNLOADING_WEBPAGE });
      }

      const progress = parseDownload(data);
      if (progress) {
        onUpdate(progress);
      }

      const ffmpegState = parseFfmpeg(data);
      if (ffmpegState) {
        onUpdate({ state: ffmpegState });
      }
    });

    child.stderr.on('data', (data) => {
      console.log(`[stderr]: ${data}`);
      onError?.(data);
    });

    child.on('close', (code) => {
      try {
        console.log('[close]', code);

        if (temporalFolder) {
          const finalOutputPath = join(
            outputFolder,
            basename(downloadDestination)
          );
          console.log(
            `Moving file from "${downloadDestination}" to ${finalOutputPath}`
          );
          onUpdate?.({ state: DownloadState.STORING });
          mkdirpSync(dirname(finalOutputPath));
          rename(downloadDestination, finalOutputPath, (err) => {
            if (err) {
              throw new Error(err.message);
            }
            onComplete?.(code);
          });
          return;
        }

        onComplete?.(code);
      } catch (e) {
        console.log('error =>', e);
        onError?.(String(e));
      }
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
