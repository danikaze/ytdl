import { DownloadState } from '../../../interfaces/download';

const DL_CORRECTING_RE = /\[ffmpeg\] Correcting container in/i;

export function parseFfmpeg(output: string): DownloadState | undefined {
  return DL_CORRECTING_RE.test(output) ? DownloadState.PROCESSING : undefined;
}
