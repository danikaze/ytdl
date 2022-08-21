import { Download } from '@interfaces/download';
import { DownloadItem } from '@renderer/components/download-item';

export interface Props {
  downloads: readonly Download[];
}

export function DownloadList({ downloads }: Props): JSX.Element {
  const list = downloads.map(({ id, url, dowloadPctg }) => (
    <DownloadItem key={id} id={id} url={url} progress={dowloadPctg} />
  ));

  return <div>{list}</div>;
}
