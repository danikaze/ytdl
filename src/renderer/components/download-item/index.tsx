import { Table } from 'evergreen-ui';
import { TABLE_COLS } from '../download-list/constants';
import { ProgressBar } from '../progress-bar';

export interface Props {
  index: number;
  url: string;
  progress: number;
}

export function DownloadItem({ index, url, progress }: Props): JSX.Element {
  return (
    <Table.Row height={32}>
      <Table.TextCell {...TABLE_COLS.index}>{index}</Table.TextCell>
      <Table.TextCell {...TABLE_COLS.url}>
        <a href={url}>{url}</a>
      </Table.TextCell>
      <Table.Cell {...TABLE_COLS.progress}>
        <ProgressBar progress={progress} />
      </Table.Cell>
    </Table.Row>
  );
}
