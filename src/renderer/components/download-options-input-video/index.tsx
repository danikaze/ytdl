import { Pane, Heading, Select } from 'evergreen-ui';
import { useDownloadOptionsInputVideo } from './hooks';

export function DownloadOptionsInputVideo(): JSX.Element | null {
  const { downloadVideoOptions, updateVideoFormat } =
    useDownloadOptionsInputVideo();

  return (
    <Pane>
      <Heading>Video file format</Heading>
      <Select
        defaultValue={downloadVideoOptions.format}
        onChange={updateVideoFormat}
      >
        <option value="best">best</option>
        <option value="mp4">mp4</option>
        <option value="webm">webm</option>
        <option value="3gp">3gp</option>
        <option value="flv">flv</option>
        <option value="worst">worst</option>
      </Select>
    </Pane>
  );
}
