import { Pane, Heading, Text, TextInput } from 'evergreen-ui';
import { RefObject, useMemo, useRef } from 'react';
import { AudioProcessOptions } from '@interfaces/download';

export interface Props {
  show: boolean;
  onChange: (metadata: Required<AudioProcessOptions>['metadata']) => void;
}

export function DownloadOptionsInputAudioMetadata({
  show,
  onChange,
}: Props): JSX.Element {
  const textStyle = useMemo(
    () =>
      ({
        display: 'inline-block',
        width: 35,
        textAlign: 'right',
        marginRight: 8,
      } as const),
    []
  );

  const refs = getRefs();
  const onChangeHandler = getOnChange(refs, onChange);

  return (
    <Pane display={show ? undefined : 'none'}>
      <Heading>Audio metadata</Heading>
      <Pane>
        <Text {...textStyle}>Artist: </Text>
        <TextInput
          placeholder="Artist"
          ref={refs.artist}
          onChange={onChangeHandler}
        />
      </Pane>
      <Pane>
        <Text {...textStyle}>Title: </Text>
        <TextInput
          placeholder="Title"
          ref={refs.title}
          onChange={onChangeHandler}
        />
      </Pane>
    </Pane>
  );
}

function getRefs(): Partial<
  Record<
    keyof Required<AudioProcessOptions>['metadata'],
    RefObject<HTMLInputElement>
  >
> {
  return {
    artist: useRef<HTMLInputElement>(null),
    title: useRef<HTMLInputElement>(null),
  };
}

function getOnChange(
  refs: ReturnType<typeof getRefs>,
  callback: Props['onChange']
) {
  return () => {
    const metadata = Object.entries(refs).reduce((acc, [key, ref]) => {
      (acc as any)[key] = ref.current?.value || '';
      return acc;
    }, {} as Required<AudioProcessOptions>['metadata']);
    callback(metadata);
  };
}
