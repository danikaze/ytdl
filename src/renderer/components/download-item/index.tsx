import { Download } from '@interfaces/download';
import { useYtdlTheme } from '@renderer/themes';
import { formatSpeed, formatTime } from '@utils/format';
import { StatusIndicator, Table } from 'evergreen-ui';
import { TABLE_COLS } from '../download-list/constants';
import { ProgressBar } from '../progress-bar';

import styles from './download-item.module.scss';

export type Props = {
  index: number;
} & Download;

export function DownloadItem({
  index,
  state,
  url,
  downloadPctg: donwloadPctg,
  size,
  speed,
  eta,
}: Props): JSX.Element {
  const theme = useYtdlTheme();
  const formattedSpeed = formatSpeed(speed);
  const formattedEta = formatTime(eta);

  return (
    <Table.Row height={32}>
      <Table.TextCell {...TABLE_COLS.index}>{index}</Table.TextCell>
      <Table.TextCell {...TABLE_COLS.url}>
        <StatusIndicator
          color={theme.components.DownloadState[state]}
          margin={0}
        />
        <a className={styles.url} href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      </Table.TextCell>
      <Table.TextCell {...TABLE_COLS.size}>{size}</Table.TextCell>
      <Table.Cell {...TABLE_COLS.progress}>
        <ProgressBar progress={donwloadPctg} />
      </Table.Cell>
      <Table.TextCell {...TABLE_COLS.speed}>{formattedSpeed}</Table.TextCell>
      <Table.TextCell {...TABLE_COLS.eta}>{formattedEta}</Table.TextCell>
    </Table.Row>
  );
}
