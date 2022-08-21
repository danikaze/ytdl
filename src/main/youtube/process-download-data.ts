import { YoutubeDlProgress } from './types';

// [download]  35.9% of 31.25MiB at 58.80KiB/s ETA 05:48
const DL_PROGRESS_RE =
  /\[download\]\s+([0-9.%]+)\s+of\s+([^ ]+)\s+at\s+([^ ]+)\s+ETA\s+([0-9:]+)/i;
// [download] 100% of 31.25MiB in 09:07
const DL_COMPLETE_RE = /\[download\]\s+100% of ([^ ]+)\s+in([0-9:]+)/i;
// 79.30KiB/s
const SPEED_RE = /([0-9.]+)(ib|kib|mib|gib)\/s/i;

const BYTE_MAP = {
  kib: 1e3,
  mib: 1e6,
  gib: 1e12,
};

export function processDownloadData(
  data: string
): YoutubeDlProgress | undefined {
  const finished = DL_COMPLETE_RE.exec(data);
  if (finished) {
    return {
      percentage: 100,
      speed: undefined,
      eta: undefined,
      size: finished[1],
    };
  }

  const progress = DL_PROGRESS_RE.exec(data);
  if (!progress) return undefined;

  return {
    percentage: parsePercentage(progress[1]),
    size: progress[2],
    speed: parseSpeed(progress[3]),
    eta: parseTime(progress[4]),
  };
}

function parsePercentage(txt: string): number | undefined {
  const pctg = parseFloat(txt);
  return Number.isNaN(pctg) ? undefined : pctg;
}

function parseSpeed(txt: string): number | undefined {
  const match = SPEED_RE.exec(txt);
  if (!match) return undefined;
  const digits = Number(match[1]);
  const toBytes = BYTE_MAP[match[2].toLowerCase() as keyof typeof BYTE_MAP];
  return digits * toBytes;
}

function parseTime(txt: string): number {
  const parts = txt.split(':').map((part) => Number(part));
  let seconds = 0;
  let toS = 1;

  for (let i = parts.length - 1; i >= 0; i--) {
    seconds += parts[i] * toS;
    toS *= 60;
  }

  return seconds;
}
