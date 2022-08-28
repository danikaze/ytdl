const DL_DESTINATION_RE = /\[download|ffmpeg\]\s+Destination:\s+(.*)/i;

export function parseDestination(output: string): string | undefined {
  const destination = DL_DESTINATION_RE.exec(output);
  return destination ? destination[1] : undefined;
}
