import { Heading, Pane, Select } from 'evergreen-ui';
import { useDownloadOptionsInputAudio } from './hooks';

export function DownloadOptionsInputAudio(): JSX.Element | null {
  const { downloadAudioOptions, updateAudioFormat } =
    useDownloadOptionsInputAudio();

  return (
    <Pane>
      <Heading>Audio file format</Heading>
      <Select
        defaultValue={downloadAudioOptions.format}
        onChange={updateAudioFormat}
      >
        <option value="best">best</option>
        <option value="aac">aac</option>
        <option value="flac">flac</option>
        <option value="mp3">mp3</option>
        <option value="m4a">m4a</option>
        <option value="opus">opus</option>
        <option value="vorbis">vorbis</option>
        <option value="wav">wav</option>
      </Select>
    </Pane>
  );
}
