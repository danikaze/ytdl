const DL_DESTINATION_RE = /\[(download|ffmpeg)\]\s+Destination:\s+(.*)/i;
const DL_ALREADY_DONE_RE =
  /\[(download)\]\s+(.+)\s+has already been downloaded/i;

export function parseDestination(output: string): string | undefined {
  const match =
    DL_DESTINATION_RE.exec(output) || DL_ALREADY_DONE_RE.exec(output);

  return match ? match[2] : undefined;
}
