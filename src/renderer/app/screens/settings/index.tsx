import { useAppScreen } from '@renderer/jotai/app-screen';
import { useSettingsPage } from '@renderer/jotai/settings-page';
import { useYtdlTheme } from '@renderer/themes';
import {
  Button,
  Heading,
  Pane,
  Tab,
  Tablist,
  TabNavigation,
} from 'evergreen-ui';
import { useMemo } from 'react';
import { AppSettings } from './app-settings';
import { DownloadSettings } from './download-settings';
import { MetadataSettings } from './metadata-settings';

import styles from './settings.module.scss';

/* eslint-disable @typescript-eslint/naming-convention */
const TABS = [
  { id: 'app', label: 'App', Content: AppSettings },
  { id: 'downloads', label: 'Downloads', Content: DownloadSettings },
  { id: 'metadata', label: 'Metadata', Content: MetadataSettings },
] as const;
/* eslint-enable @typescript-eslint/naming-convention */

export function SettingsScreen() {
  return (
    <div className={styles.root}>
      <TopPart />
      <LeftBar />
      <Main />
    </div>
  );
}

function TopPart() {
  const { setScreen } = useAppScreen();
  const goBack = useMemo(() => () => setScreen('downloads'), [setScreen]);

  const theme = useYtdlTheme();
  const topStyle = {
    background: theme.roles.header.background,
  };

  return (
    <div className={styles.top} style={topStyle}>
      <Pane flex={1} alignItems="center" display="flex">
        <Heading size={800}>Settings</Heading>
      </Pane>
      <Pane display="flex" alignItems="center">
        <Button onClick={goBack}>Close</Button>
      </Pane>
    </div>
  );
}

function LeftBar() {
  const { settingsPage, setSettingsPage } = useSettingsPage();

  const tabList = TABS.map(({ id, label }) => (
    <TabNavigation key={id}>
      <Tab
        direction="vertical"
        isSelected={id === settingsPage}
        onSelect={() => setSettingsPage(id)}
        size={400}
      >
        {label}
      </Tab>
    </TabNavigation>
  ));

  return (
    <div className={styles.left}>
      <Tablist>{tabList}</Tablist>
    </div>
  );
}

function Main() {
  /* eslint-disable @typescript-eslint/naming-convention */
  const { settingsPage } = useSettingsPage();

  const content = TABS.map(({ id, Content }) => (
    <div key={id} className={id !== settingsPage ? styles.hidden : ''}>
      <Content />
    </div>
  ));

  return (
    <Pane className={styles.main} role="tabpanel">
      {content}
    </Pane>
  );
}
