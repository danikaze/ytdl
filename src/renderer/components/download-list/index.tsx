import { Table } from 'evergreen-ui';
import { Download } from '@interfaces/download';
import { DownloadItem } from '@renderer/components/download-item';
import { TABLE_COLS } from './constants';

export interface Props {
  downloads: readonly Download[];
}

export function DownloadList({ downloads }: Props): JSX.Element {
  const list = downloads.map(({ id, url, dowloadPctg }, index) => (
    <DownloadItem key={id} index={index + 1} url={url} progress={dowloadPctg} />
  ));

  return (
    <Table marginTop={16} marginBottom={16}>
      {renderHeader()}
      <Table.Body>{list}</Table.Body>
    </Table>
  );
}

function renderHeader(): JSX.Element {
  return (
    <Table.Head height={32}>
      <Table.TextHeaderCell {...TABLE_COLS.index}>#</Table.TextHeaderCell>
      <Table.TextHeaderCell {...TABLE_COLS.url}>URL</Table.TextHeaderCell>
      <Table.TextHeaderCell {...TABLE_COLS.progress}>
        Progress
      </Table.TextHeaderCell>
    </Table.Head>
  );
}
