import { DownloadType } from '@renderer/jotai/download-options';
import { Heading, Pane, Select, Text, TextInput } from 'evergreen-ui';
import { DownloadOptionsInputAudio } from '../download-options-input-audio';
import { DownloadOptionsInputVideo } from '../download-options-input-video';
import { PathPicker } from '../path-picker';
import { useDownloadOptionsInput } from './hooks';

export function DownloadOptionsInput(): JSX.Element {
  const {
    downloadType,
    outputFile,
    outputFolder,
    onFileChange,
    onFolderChange,
    onTypeChange,
  } = useDownloadOptionsInput();

  return (
    <Pane paddingRight={16} width="50%" overflowX="hidden">
      <Heading size={500} marginBottom={8}>
        Filename
      </Heading>
      <Text size={300}>File extension is not required.</Text>
      <TextInput
        placeholder="Name for the downloaded file"
        defaultValue={outputFile}
        onChange={onFileChange}
      />

      <Heading size={500} marginBottom={8}>
        Destination folder
      </Heading>
      <PathPicker
        placeholder="Destination folder"
        dialogOptions={{ properties: ['openDirectory'] }}
        defaultValue={outputFolder}
        onChange={onFolderChange}
      />

      <Heading size={500} marginBottom={8}>
        Download as
      </Heading>
      <Select onChange={onTypeChange}>
        <option value="video">Video</option>
        <option value="audio">Audio only</option>
      </Select>
      {renderDlTypeInput(downloadType)}
    </Pane>
  );
}

function renderDlTypeInput(type: DownloadType): JSX.Element | null {
  return (
    <>
      <Pane display={type === 'audio' ? '' : 'none'}>
        <DownloadOptionsInputAudio />
      </Pane>
      <Pane display={type === 'video' ? '' : 'none'}>
        <DownloadOptionsInputVideo />
      </Pane>
    </>
  );
}
