export const enum DownloadState {
  INITIALIZATING,
  DOWNLOADING_WEBPAGE,
  DOWNLOADING,
  PROCESSING,
  STORING,
  COMPLETED,
  ERRORED,
  PAUSED,
}

export interface Download {
  id: string;
  state: DownloadState;
  url: string;
  downloadPctg: number;
  temporalFile: string;
  size?: string;
  speed?: number;
  eta?: number;
  error?: string;
}
