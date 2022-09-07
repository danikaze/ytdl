import { Heading, LinkIcon, Pane, Spinner, Text } from 'evergreen-ui';
import { useDownloadOptions } from '@renderer/jotai/download-options';
import { formatTime } from '@utils/format';
import { YoutubeDlMetadata } from '@utils/youtube/types';
import { useYtdlTheme } from '@renderer/themes';

export function DownloadOptionsInfo(): JSX.Element {
  const modal = useDownloadOptions();
  const theme = useYtdlTheme();

  const contents = modal.error
    ? renderError(modal.error, theme.intents.danger.text)
    : !modal.metadata
    ? renderLoading()
    : renderInfo(modal.metadata);

  return (
    <Pane paddingLeft={16} width="50%" display="flex" flexDirection="column">
      <Heading size={500} marginBottom={8}>
        Video information
      </Heading>
      {contents}
    </Pane>
  );
}

function renderLoading(): JSX.Element {
  return (
    <>
      <Pane
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        <Spinner />
      </Pane>
    </>
  );
}

function renderInfo(metadata: YoutubeDlMetadata): JSX.Element {
  const { title, duration, thumbnail, webpage_url: url } = metadata;

  return (
    <Pane>
      <a href={url} target="_blank" rel="noreferrer">
        <LinkIcon size={12} marginLeft={0} marginRight={8} />
      </a>
      <Text>{title}</Text>
      <div>
        <Text>Duration: {formatTime(duration)}</Text>
      </div>
      <div>
        <img width={200} src={thumbnail} alt={title} />
      </div>
    </Pane>
  );
}

function renderError(error: string, errorColor: string): JSX.Element {
  return (
    <Pane>
      <Text color={errorColor}>{error}</Text>
    </Pane>
  );
}
