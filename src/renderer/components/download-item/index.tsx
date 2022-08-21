export interface Props {
  id: string;
  url: string;
  progress: number;
}

export function DownloadItem({ id, url, progress }: Props): JSX.Element {
  return (
    <div key={id}>
      <div>Url: {url}</div>
      <div>Progress: {progress}</div>
    </div>
  );
}
