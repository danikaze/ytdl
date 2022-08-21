import { useYtdlTheme } from '@renderer/themes';
import { Pane, Strong } from 'evergreen-ui';

import styles from './progress-bar.module.scss';

export interface Props {
  progress: number;
}

export function ProgressBar({ progress }: Props): JSX.Element {
  const theme = useYtdlTheme().components.ProgressBar;
  const bgStyle = {
    backgroundColor: theme.barPending,
    color: theme.text,
  };
  const fgStyle = {
    backgroundColor: theme.barCompleted,
    width: `${progress}%`,
  };

  return (
    <Pane
      className={styles.root}
      style={bgStyle}
      borderRadius={theme.borderRadius}
    >
      <Strong className={styles.text} size={300} zIndex={2}>
        {progress}%
      </Strong>
      <Pane
        className={styles.completed}
        style={fgStyle}
        borderRadius={theme.borderRadius}
      />
    </Pane>
  );
}
