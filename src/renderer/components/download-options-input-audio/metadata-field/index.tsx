import { RefObject, useMemo } from 'react';
import { IconButton, Pane, Text, TextInput, TrashIcon } from 'evergreen-ui';
import { MetadataFieldImage, MetadataImageFieldData } from './image';

export interface Props {
  field: MetadataFieldData;
  onChange: () => void;
}

export type MetadataFieldData = MetadataTextField | MetadataImageFieldData;

export interface MetadataTextField {
  field: string;
  label: string;
  type: 'text';
  ref: RefObject<HTMLInputElement>;
  remove: () => void;
}

export function MetadataField({ field, onChange }: Props): JSX.Element {
  const FIELD_LABEL_TEXT_STYLE = useMemo(
    () =>
      ({
        display: 'inline-block',
        width: 35,
        textAlign: 'right',
        marginRight: 8,
      } as const),
    []
  );

  const content =
    field.type === 'image' ? (
      <MetadataFieldImage field={field} onChange={onChange} />
    ) : (
      <TextInput ref={field.ref} onChange={onChange} />
    );

  return (
    <Pane key={field.field} display="flex" alignItems="center" marginBottom={4}>
      <Text {...FIELD_LABEL_TEXT_STYLE}>{field.label}: </Text>
      {content}
      <IconButton icon={TrashIcon} marginLeft={4} onClick={field.remove} />
    </Pane>
  );
}
