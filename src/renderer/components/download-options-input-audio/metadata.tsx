import { RefObject } from 'react';
import {
  Pane,
  Heading,
  Text,
  TextInput,
  IconButton,
  TrashIcon,
  Select,
} from 'evergreen-ui';
import { AudioProcessOptions } from '@interfaces/download';
import {
  MetadataField,
  useDownloadOptionsInputAudioMetadata,
} from './metadata-hooks';

export interface Props {
  show: boolean;
  onChange: (metadata: Required<AudioProcessOptions>['metadata']) => void;
}

export function DownloadOptionsInputAudioMetadata(props: Props): JSX.Element {
  const { addField, addFieldRef, fields, selectedFields, onChangeHandler } =
    useDownloadOptionsInputAudioMetadata(props);
  const { show } = props;

  const fieldList = selectedFields.map((field) =>
    renderField(fields[field], onChangeHandler)
  );

  return (
    <Pane display={show ? undefined : 'none'}>
      <Heading>Audio metadata</Heading>

      {fieldList}
      <Pane marginTop={8}>
        {renderAddFieldButton(addField, addFieldRef, fields, selectedFields)}
      </Pane>
    </Pane>
  );
}

function renderField(field: MetadataField, onChange: () => void): JSX.Element {
  const textStyle = {
    display: 'inline-block',
    width: 35,
    textAlign: 'right',
    marginRight: 8,
  } as const;

  return (
    <Pane key={field.field} display="flex" alignItems="center" marginBottom={4}>
      <Text {...textStyle}>{field.label}: </Text>
      <TextInput ref={field.ref} onChange={onChange} />
      <IconButton icon={TrashIcon} marginLeft={4} onClick={field.remove} />
    </Pane>
  );
}

function renderAddFieldButton(
  addField: () => void,
  addFieldRef: RefObject<HTMLSelectElement>,
  fields: ReturnType<typeof useDownloadOptionsInputAudioMetadata>['fields'],
  selectedFields: (keyof typeof fields)[]
): JSX.Element | null {
  const availableFields = Object.entries(fields).reduce(
    (unselectedFields, [name, field]) => {
      if (!selectedFields.includes(name as keyof typeof fields)) {
        unselectedFields.push(field);
      }
      return unselectedFields;
    },
    [] as MetadataField[]
  );

  if (availableFields.length === 0) return null;

  return (
    <Select ref={addFieldRef} onChange={addField}>
      <option value="">Add metadata field</option>
      {availableFields.map((field) => (
        <option key={field.field} value={field.field}>
          {field.label}
        </option>
      ))}
    </Select>
  );
}
