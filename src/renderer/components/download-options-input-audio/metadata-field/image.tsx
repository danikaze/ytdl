import { Button, Spinner, Text } from 'evergreen-ui';
import { RefObject } from 'react';
import { PathPicker } from '@renderer/components/path-picker';
import { useMetadataFieldImage } from './image-hooks';

export interface Props {
  field: MetadataImageFieldData;
  onChange: () => void;
}

export interface MetadataImageFieldData {
  field: string;
  label: string;
  type: 'image';
  ref: RefObject<HTMLInputElement>;
  remove: () => void;
}

export function MetadataFieldImage(props: Props): JSX.Element {
  const {
    error,
    field,
    state,
    value,
    imageUrl,
    useVideoCover,
    useFile,
    selectFile,
  } = useMetadataFieldImage(props);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const input = value && (
    <input hidden ref={field.ref} value={value} readOnly />
  );
  const imgPreview = imageUrl ? (
    <div style={{ marginRight: '4px' }}>
      <img src={imageUrl} alt="Thumbnail preview" height={32} />
    </div>
  ) : state === 'url' ? (
    <Spinner />
  ) : null;

  if (state === 'url') {
    return (
      <>
        {imgPreview}
        <Text>Youtube thumbnail</Text>
        {input}
      </>
    );
  }

  if (state === 'file') {
    return (
      <>
        {imgPreview}
        <PathPicker
          fullWidth
          dialogOptions={{ properties: ['openFile'] }}
          onChange={selectFile}
        />
        {input}
      </>
    );
  }

  return (
    <>
      <Button disabled={state === 'waiting'} onClick={useVideoCover}>
        Use video cover
      </Button>
      <Button onClick={useFile} marginLeft={4}>
        Use file
      </Button>
      <input hidden ref={field.ref} value={value} />
    </>
  );
}
