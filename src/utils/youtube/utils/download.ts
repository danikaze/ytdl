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
import { YoutubeDlOptions, YoutubeDlReturn } from '../types';
import { getExePath } from './get-exe-path';

const STOP_SIGNAL: NodeJS.Signals = 'SIGINT';

export function youtubeDownload({
  args,
  outputFolder,
  outputFile,
  onStart,
  onUpdate,
  onError,
  onComplete,
}: YoutubeDlOptions): YoutubeDlReturn | undefined {
  const exePath = getExePath();
  // console.log(`${basename(exePath)} ${args.join(' ')}`);
  try {
    if (args.includes('-o')) {
      throw new Error(
        'Do not use -o args, but use outputFolder and outputFile instead'
      );
    }

    const temporalFolder =
      mainSettings.get('downloads.useTemporalFolder') &&
      mainSettings.get('downloads.temporalFolder');
    const temporalFile = join(
      temporalFolder || outputFolder,
      `${outputFile}.%(ext)s`
    );
    let downloadDestination: string;
    let reportedDestination: string;

    onStart?.({
      temporalFile,
    });

    const exeArgs = ['-o', temporalFile, ...args];
    const child = spawn(exePath, exeArgs);

    child.stdout.on('data', (dataBuffer) => {
      const data = String(dataBuffer);

      const destination = parseDestination(data);
      if (destination) {
        downloadDestination = destination;
      }
      if (!onUpdate) return;

      if (downloadDestination !== reportedDestination) {
        reportedDestination = downloadDestination;
        onUpdate({ outputFile: reportedDestination });
      }

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

    child.stderr.on('data', (dataBuffer) => {
      const data = String(dataBuffer);
      console.log(`[stderr]: ${data}`);
      onError?.(data);
    });

    child.on('exit', (code, signal) => {
      try {
        console.log('[exit]', code, signal);

        if (signal === STOP_SIGNAL) {
          onUpdate?.({ state: DownloadState.PAUSED });
          return;
        }

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
            onComplete?.(code, finalOutputPath);
          });
          return;
        }

        onComplete?.(code, downloadDestination);
      } catch (e) {
        console.log('error =>', e);
        onError?.(String(e));
      }
    });

    const stop = () => {
      child.kill(STOP_SIGNAL);
    };

    return { stop };
  } catch (e) {
    onError?.(String(e));
    console.error(e);
    return undefined;
  }
}
