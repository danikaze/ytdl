import NodeID3 from 'node-id3';
import { RefObject, useRef, useState } from 'react';
import { removeFromArrayAndCopy } from '@utils/remove-from-array';
import type { Props } from './metadata';

export interface MetadataField {
  field: string;
  label: string;
  ref: RefObject<HTMLInputElement>;
  remove: () => void;
}

export function useDownloadOptionsInputAudioMetadata({ onChange }: Props) {
  const fields = {
    artist: {
      field: 'artist',
      label: 'Artist',
      ref: useRef<HTMLInputElement>(null),
      remove: () => removeSelectedField('artist'),
    },
    title: {
      field: 'title',
      label: 'Title',
      ref: useRef<HTMLInputElement>(null),
      remove: () => removeSelectedField('title'),
    },
    album: {
      field: 'album',
      label: 'Album',
      ref: useRef<HTMLInputElement>(null),
      remove: () => removeSelectedField('album'),
    },
    year: {
      field: 'year',
      label: 'Year',
      ref: useRef<HTMLInputElement>(null),
      remove: () => removeSelectedField('year'),
    },
    trackNumber: {
      field: 'trackNumber',
      label: 'Track Number',
      ref: useRef<HTMLInputElement>(null),
      remove: () => removeSelectedField('trackNumber'),
    },
    comment: {
      field: 'comment',
      label: 'Comment',
      ref: useRef<HTMLInputElement>(null),
      remove: () => removeSelectedField('comment'),
    },
    performerInfo: {
      field: 'performerInfo',
      label: 'Album Artist',
      ref: useRef<HTMLInputElement>(null),
      remove: () => removeSelectedField('performerInfo'),
    },
    composer: {
      field: 'composer',
      label: 'Composer',
      ref: useRef<HTMLInputElement>(null),
      remove: () => removeSelectedField('composer'),
    },
    publisher: {
      field: 'publisher',
      label: 'Publisher',
      ref: useRef<HTMLInputElement>(null),
      remove: () => removeSelectedField('publisher'),
    },
  };

  const addFieldRef = useRef<HTMLSelectElement>(null);
  const [selectedFields, setSelectedFields] = useState<(keyof typeof fields)[]>(
    ['artist', 'title']
  );

  function calculateMetadata(): NodeID3.Tags {
    return selectedFields.reduce((tags, name) => {
      const field = fields[name];
      if (field.ref.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (tags as any)[field.field] = field.ref.current.value;
      }
      return tags;
    }, {} as NodeID3.Tags);
  }

  function onChangeHandler(): void {
    onChange(calculateMetadata());
  }

  function removeSelectedField(name: keyof typeof fields): void {
    setSelectedFields((state) => {
      return removeFromArrayAndCopy(state, name);
    });
  }

  function addField(): void {
    setSelectedFields((current) => {
      if (!addFieldRef.current || !addFieldRef.current.value) return current;
      return [...current, addFieldRef.current.value as typeof current[number]];
    });
  }

  return {
    addFieldRef,
    fields,
    selectedFields,
    addField,
    onChangeHandler,
  };
}
