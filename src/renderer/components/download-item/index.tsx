import { Download, DownloadState } from '@interfaces/download';
import { useYtdlTheme } from '@renderer/themes';
import { useContextMenu } from '@renderer/utils/open-context-menu';
import { formatSpeed, formatTime } from '@utils/format';
import { StatusIndicator, Table, Tooltip } from 'evergreen-ui';
import { TABLE_COLS } from '../download-list/constants';
import { ProgressBar } from '../progress-bar';

import styles from './download-item.module.scss';

export type Props = {
  index: number;
} & Download;

export function DownloadItem({
  id,
  index,
  state,
  url,
  downloadPctg: donwloadPctg,
  size,
  speed,
  eta,
  error,
}: Props): JSX.Element {
  const openContextMenu = useContextMenu({ type: 'downloadItem', id }, [id]);
  const formattedSpeed = formatSpeed(speed);
  const formattedEta = formatTime(eta);

  return (
    <Table.Row height={32} onContextMenu={openContextMenu}>
      <Table.TextCell {...TABLE_COLS.index}>{index + 1}</Table.TextCell>
      <Table.TextCell {...TABLE_COLS.url}>
        {renderStatusIcon(state, error)}
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

function renderStatusIcon(state: DownloadState, error?: string): JSX.Element {
  const theme = useYtdlTheme();

  const icon = (
    <StatusIndicator color={theme.components.DownloadState[state]} margin={0} />
  );

  return state === DownloadState.ERRORED && error ? (
    <Tooltip content={error}>{icon}</Tooltip>
  ) : (
    icon
  );
}
