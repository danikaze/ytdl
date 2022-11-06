import { Checkbox, Pane, Select, Text, TextInput } from 'evergreen-ui';
import { SettingsSection } from '@renderer/components/settings-section';
import { SettingsItem } from '@renderer/components/settings-item';
import { useMetadataSettings } from './hooks';

export function MetadataSettings() {
  const {
    initialMaxBytes,
    initialResizeEnabled,
    initialResizeType,
    initialResizeWidth,
    initialResizeHeight,
    updateMaxBytes,
    updateResizeEnabled,
    updateResizeType,
    updateWidth,
    updateHeight,
  } = useMetadataSettings();

  return (
    <Pane role="tabpanel">
      <SettingsSection title="Metadata">
        <SettingsItem
          title="Audio covers max size"
          description="Maximum size in kb for the images added in the audio metadata."
        >
          <TextInput
            type="number"
            width={80}
            defaultValue={initialMaxBytes}
            onChange={updateMaxBytes}
          />{' '}
          <Text>kb</Text>
        </SettingsItem>
        <SettingsItem title="Audio covers resizing" description="">
          <Checkbox
            label="Enable resizing"
            checked={initialResizeEnabled}
            onChange={updateResizeEnabled}
          />
          <Pane>
            <Text>Resize type: </Text>
            <Select
              defaultValue={initialResizeType}
              onChange={updateResizeType}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </Select>
          </Pane>
          <Pane>
            <Text>Max size: </Text>
            <TextInput
              type="number"
              width={80}
              defaultValue={initialResizeWidth}
              onChange={updateWidth}
            />{' '}
            <Text>px x</Text>{' '}
            <TextInput
              type="number"
              width={80}
              defaultValue={initialResizeHeight}
              onChange={updateHeight}
            />{' '}
            <Text>px</Text>
          </Pane>
        </SettingsItem>
      </SettingsSection>
    </Pane>
  );
}
