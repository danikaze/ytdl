import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AudioProcessOptions } from '@interfaces/download';
import { removeFromArrayAndCopy } from '@utils/remove-from-array';
import type { Props } from './metadata';

export function useDownloadOptionsInputAudioMetadata({ onChange }: Props) {
  const refs = {
    artist: useRef<HTMLInputElement>(null),
    title: useRef<HTMLInputElement>(null),
    album: useRef<HTMLInputElement>(null),
    year: useRef<HTMLInputElement>(null),
    trackNumber: useRef<HTMLInputElement>(null),
    comment: useRef<HTMLInputElement>(null),
    performerInfo: useRef<HTMLInputElement>(null),
    composer: useRef<HTMLInputElement>(null),
    publisher: useRef<HTMLInputElement>(null),
    frontCover: useRef<HTMLInputElement>(null),
  };
  const addFieldRef = useRef<HTMLSelectElement>(null);
  const [selectedFields, setSelectedFields] = useState<(keyof typeof fields)[]>(
    ['artist', 'title', 'frontCover']
  );

  const removeSelectedField: (name: keyof typeof fields) => void = useCallback(
    (name) =>
      setSelectedFields((state) => {
        return removeFromArrayAndCopy(state, name);
      }),
    [setSelectedFields]
  );

  const fields = useMemo(
    () =>
      ({
        artist: {
          field: 'artist',
          label: 'Artist',
          type: 'text',
          ref: refs.artist,
          remove: () => removeSelectedField('artist'),
        },
        title: {
          field: 'title',
          label: 'Title',
          type: 'text',
          ref: refs.title,
          remove: () => removeSelectedField('title'),
        },
        album: {
          field: 'album',
          label: 'Album',
          type: 'text',
          ref: refs.album,
          remove: () => removeSelectedField('album'),
        },
        year: {
          field: 'year',
          label: 'Year',
          type: 'text',
          ref: refs.year,
          remove: () => removeSelectedField('year'),
        },
        trackNumber: {
          field: 'trackNumber',
          label: 'Track Number',
          type: 'text',
          ref: refs.trackNumber,
          remove: () => removeSelectedField('trackNumber'),
        },
        comment: {
          field: 'comment',
          label: 'Comment',
          type: 'text',
          ref: refs.comment,
          remove: () => removeSelectedField('comment'),
        },
        performerInfo: {
          field: 'performerInfo',
          label: 'Album Artist',
          type: 'text',
          ref: refs.performerInfo,
          remove: () => removeSelectedField('performerInfo'),
        },
        composer: {
          field: 'composer',
          label: 'Composer',
          type: 'text',
          ref: refs.composer,
          remove: () => removeSelectedField('composer'),
        },
        publisher: {
          field: 'publisher',
          label: 'Publisher',
          type: 'text',
          ref: refs.publisher,
          remove: () => removeSelectedField('publisher'),
        },
        frontCover: {
          field: 'frontCover',
          label: 'Front Cover',
          type: 'image',
          ref: refs.frontCover,
          remove: () => removeSelectedField('frontCover'),
        },
      } as const),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [removeSelectedField]
  );

  const calculateMetadata =
    useCallback((): Required<AudioProcessOptions>['metadata'] => {
      return selectedFields.reduce((tags, name) => {
        const field = fields[name];
        const value = field.ref.current?.value;
        if (value) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (tags as any)[field.field] = value;
        }
        return tags;
      }, {} as Required<AudioProcessOptions>['metadata']);
    }, [fields, selectedFields]);

  const onChangeHandler = useCallback((): void => {
    onChange(calculateMetadata());
  }, [onChange, calculateMetadata]);

  const addField = useCallback((): void => {
    setSelectedFields((current) => {
      if (!addFieldRef.current || !addFieldRef.current.value) return current;
      return [...current, addFieldRef.current.value as typeof current[number]];
    });
  }, [setSelectedFields]);

  useEffect(
    () => onChange(calculateMetadata()),
    [onChange, calculateMetadata, selectedFields]
  );

  return {
    addFieldRef,
    fields,
    selectedFields,
    addField,
    onChangeHandler,
  };
}
