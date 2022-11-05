import { RefObject } from 'react';
import { Pane, Heading, Select } from 'evergreen-ui';
import { AudioProcessOptions } from '@interfaces/download';
import { useDownloadOptionsInputAudioMetadata } from './metadata-hooks';
import { MetadataField, MetadataFieldData } from './metadata-field';

export interface Props {
  show: boolean;
  onChange: (metadata: Required<AudioProcessOptions>['metadata']) => void;
}

export function DownloadOptionsInputAudioMetadata(props: Props): JSX.Element {
  const { addField, addFieldRef, fields, selectedFields, onChangeHandler } =
    useDownloadOptionsInputAudioMetadata(props);
  const { show } = props;

  const fieldList = selectedFields.map((field) => (
    <MetadataField
      key={field}
      field={fields[field]}
      onChange={onChangeHandler}
    />
  ));

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
    [] as MetadataFieldData[]
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
