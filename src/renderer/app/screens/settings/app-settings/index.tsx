import { Pane, Text } from 'evergreen-ui';
import { useSettings } from '@renderer/jotai/settings';
import { SettingsSection } from '@renderer/components/settings-section';
import { SettingsItem } from '@renderer/components/settings-item';

export function AppSettings() {
  const { settings } = useSettings();

  return (
    <Pane role="tabpanel">
      <SettingsSection title="App">
        <SettingsItem title="youtube-dl version">
          <Text>{settings.youtubeDlVersion}</Text>
        </SettingsItem>
      </SettingsSection>
    </Pane>
  );
}
