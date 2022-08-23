export function formatSize(bytes: number | undefined): string {
  if (bytes === undefined) return '';
  const units = ['iB', 'KiB', 'MiB', 'GiB', 'TiB'];
  let ratio = 1;
  let tryRatio = 1024;
  let unitIndex = 0;

  while (unitIndex < units.length - 1 && bytes / tryRatio > 1) {
    ratio = tryRatio;
    tryRatio *= 1024;
    unitIndex++;
  }

  const value = numberWithCommas(Math.round(bytes / ratio));
  const unit = units[unitIndex];
  return `${value}${unit}`;
}

export function formatSpeed(bps: number | undefined): string {
  const size = formatSize(bps);
  if (size === '') return '';
  return `${size}/s`;
}

export function formatTime(secs: number | undefined): string {
  if (secs === undefined) return '';
  if (secs === Infinity) return `∞`;

  let s = secs;
  let m = 0;
  let h = 0;
  let d = 0;

  if (s / 60 > 1) {
    m = Math.floor(s / 60);
    s %= 60;
  }

  if (m / 60 > 1) {
    h = Math.floor(m / 60);
    m %= 60;
  }

  if (h / 24 > 1) {
    d = Math.floor(h / 24);
    h %= 24;
  }

  const fd = d > 0 ? `${d}d` : '';
  const fh = h > 0 ? ` ${h}h` : '';
  const fm = d > 0 ? '' : ` ${m}m`;
  const fs = h > 0 ? '' : ` ${s}s`;

  return `${fd}${fh}${fm}${fs}`;
}

function numberWithCommas(n: number | string): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
