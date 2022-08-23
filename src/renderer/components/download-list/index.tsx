import { Table } from 'evergreen-ui';
import { Download } from '@interfaces/download';
import { DownloadItem } from '@renderer/components/download-item';
import { TABLE_COLS } from './constants';

export interface Props {
  downloads: readonly Download[];
}

export function DownloadList({ downloads }: Props): JSX.Element {
  const list = downloads.map((download, index) => (
    <DownloadItem key={download.id} {...download} index={index} />
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
      <Table.TextHeaderCell {...TABLE_COLS.size}>Size</Table.TextHeaderCell>
      <Table.TextHeaderCell {...TABLE_COLS.progress}>
        Progress
      </Table.TextHeaderCell>
      <Table.TextHeaderCell {...TABLE_COLS.speed}>DL</Table.TextHeaderCell>
      <Table.TextHeaderCell {...TABLE_COLS.eta}>ETA</Table.TextHeaderCell>
    </Table.Head>
  );
}
