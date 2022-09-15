import { Checkbox, Pane, Select } from 'evergreen-ui';
import { PathPicker } from '@renderer/components/path-picker';
import { SettingsSection } from '@renderer/components/settings-section';
import { SettingsItem } from '@renderer/components/settings-item';
import { LAST_VALUE } from '@interfaces/settings';
import { useDownloadSettings } from './hooks';

export function DownloadSettings() {
  const {
    initialDownloadFolder,
    useTemporalFolder,
    initialTemporalFolder,
    downloadType,
    updateDownloadsFolder,
    updateTemporalFolder,
    updateUseTemporalFolder,
    updateDownloadType,
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
            defaultValue={initialDownloadFolder}
            dialogOptions={{ properties: ['openDirectory'] }}
          />
        </SettingsItem>
        <SettingsItem
          title="Temporal downloads folder"
          description="When enabled, the downloads will be placed in the temporal folder and moved to the download folder after the download has finished."
        >
          <Checkbox
            label="Use temporal downloads folder"
            checked={useTemporalFolder}
            onChange={updateUseTemporalFolder}
          />
          <PathPicker
            onChange={updateTemporalFolder}
            defaultValue={initialTemporalFolder}
            dialogOptions={{ properties: ['openDirectory'] }}
          />
        </SettingsItem>
        <SettingsItem
          title="Download type"
          description="What type of download should be selected by default"
        >
          <Select defaultValue={downloadType} onChange={updateDownloadType}>
            <option value={LAST_VALUE}>Remember last</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </Select>
        </SettingsItem>
      </SettingsSection>
    </Pane>
  );
}
