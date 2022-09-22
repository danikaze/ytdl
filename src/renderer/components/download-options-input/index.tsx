import {
  ArchiveIcon,
  ArrayStringIcon,
  Button,
  ErrorIcon,
  Heading,
  Pane,
  Popover,
  Position,
  Select,
  Text,
  TextInput,
  Tooltip,
} from 'evergreen-ui';
import { DownloadType } from '@interfaces/settings';
import { useYtdlTheme, YtdlTheme } from '@renderer/themes';
import { DownloadOptionsInputAudio } from '../download-options-input-audio';
import { DownloadOptionsInputVideo } from '../download-options-input-video';
import { PathPicker } from '../path-picker';
import { useDownloadOptionsInput } from './hooks';
import { MetadataMenu } from './metadata-menu';

export function DownloadOptionsInput(): JSX.Element {
  const theme = useYtdlTheme();
  const {
    fileInputRef,
    downloadType,
    filename,
    isValidFilename,
    outputFile,
    outputFolder,
    onFileChange,
    onFolderChange,
    onTypeChange,
    insertOnFileInput,
  } = useDownloadOptionsInput();

  return (
    <Pane paddingRight={16} width="50%" overflowX="hidden">
      <Heading size={500} marginBottom={8}>
        Filename
      </Heading>
      <Text size={300}>File extension is not required.</Text>
      <Pane display="flex">
        <TextInput
          ref={fileInputRef}
          placeholder="Name for the downloaded file"
          defaultValue={filename}
          onChange={onFileChange}
          borderTopRightRadius={0}
          borderBottomRightRadius={0}
        />
        <Popover
          position={Position.BOTTOM_LEFT}
          content={<MetadataMenu onSelect={insertOnFileInput} />}
        >
          <Button borderTopLeftRadius={0} borderBottomLeftRadius={0}>
            <Tooltip
              content="Display list of available metadata"
              position={Position.TOP}
            >
              <ArrayStringIcon />
            </Tooltip>
          </Button>
        </Popover>
      </Pane>
      {renderOutputFile(outputFile, isValidFilename, theme)}

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
      <Select defaultValue={downloadType} onChange={onTypeChange}>
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

function renderOutputFile(
  outputFile: string,
  isValid: boolean,
  theme: YtdlTheme
): JSX.Element {
  const Icon = isValid ? ArchiveIcon : ErrorIcon;
  const color = isValid ? theme.intents.info : theme.intents.danger;

  return (
    <Pane display="flex" alignItems="center">
      <Icon color={color.icon} size={14} marginRight={8} />{' '}
      <Text color={color.text}>{outputFile}</Text>
    </Pane>
  );
}
