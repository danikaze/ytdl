import { spawn } from 'child_process';
import { rename } from 'fs';
import { join, basename, dirname } from 'path';
import { sync as mkdirpSync } from 'mkdirp';
import { DownloadState } from '../../../interfaces/download';
import { mainSettings } from '../../../main/settings';
import { parseDestination } from '../parser/destination';
import { parseDownload } from '../parser/download';
import { parseDownloadWebsite } from '../parser/download-website';
import { parseFfmpeg } from '../parser/ffmpeg';
import { YoutubeDlOptions } from '../types';
import { getExePath } from './get-exe-path';

export function youtubeDownload({
  args,
  outputFolder,
  outputFile,
  onUpdate,
  onError,
  onComplete,
}: YoutubeDlOptions) {
  const exePath = getExePath();
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
