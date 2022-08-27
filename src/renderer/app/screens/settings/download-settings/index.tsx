import { Checkbox, Pane } from 'evergreen-ui';
import { PathPicker } from '@renderer/components/path-picker';
import { SettingsSection } from '@renderer/components/settings-section';
import { SettingsItem } from '@renderer/components/settings-item';
import { useDownloadSettings } from './hooks';

export function DownloadSettings() {
  const {
    settings,
    updateDownloadsFolder,
    updateTemporalFolder,
    updateUseTemporalFolder,
  } = useDownloadSettings();

  return (
    <Pane role="tabpanel">
      <SettingsSection title="Downloads">
        <SettingsItem
          title="Downloads folder"
          description="Modifying the download folder will apply only to new added downloads."
        >
          <PathPicker
            onChange={updateDownloadsFolder}
            defaultValue={settings.downloadFolder}
            dialogOptions={{ properties: ['openDirectory'] }}
          />
        </SettingsItem>
        <SettingsItem
          title="Temporal downloads folder"
          description="When enabled, the downloads will be placed in the temporal folder and moved to the download folder after the download has finished."
        >
          <Checkbox
            label="Use temporal downloads folder"
            checked={settings.useTemporalFolder}
            onChange={updateUseTemporalFolder}
          />
          <PathPicker
            onChange={updateTemporalFolder}
            defaultValue={settings.temporalFolder}
            dialogOptions={{ properties: ['openDirectory'] }}
          />
        </SettingsItem>
      </SettingsSection>
    </Pane>
  );
}
