// [youtube] zyhbEFhLSiw: Downloading webpage
const DL_WEBPAGE = /\[youtube\] ([^ ]+): Downloading webpage/;

export function parseDownloadWebsite(
  data: string
): { videoId: string } | undefined {
  const webpage = DL_WEBPAGE.exec(data);
  return webpage ? { videoId: webpage[1] } : undefined;
}
