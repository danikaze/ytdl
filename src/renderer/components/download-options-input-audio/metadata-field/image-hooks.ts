import { useState, useCallback, useEffect } from 'react';
import { useDownloadOptions } from '@renderer/jotai/download-options';
import {
  ImageToPrepareResult,
  ImageToPrepareResultError,
} from '@interfaces/download';
import type { Props } from './image';

type MetadataImageFieldState = 'waiting' | 'none' | 'url' | 'file';

export function useMetadataFieldImage({ field, onChange }: Props) {
  const { metadata } = useDownloadOptions();
  const [error, setError] = useState<string | undefined>(undefined);
  const [state, setState] = useState<MetadataImageFieldState>('waiting');
  const [value, setValue] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (state !== 'waiting') return;
    if (!metadata) return;
    setState('none');
  }, [metadata, state, setState]);

  const selectImage = useCallback(
    async (type: 'url' | 'file', path?: string) => {
      if (!metadata) return;

      setState(type);
      const res = await window.ytdl.prepareImage(
        type,
        path || metadata.thumbnail,
        metadata.id
      );
      if (isImageResultError(res)) {
        setError(res.error);
        setValue(undefined);
        setImageUrl(undefined);
      } else {
        setValue(res.path);
        setImageUrl(res.url);
      }
    },
    [setState, metadata]
  );

  const useVideoCover = useCallback(() => selectImage('url'), [selectImage]);

  const useFile = useCallback(() => setState('file'), [setState]);

  const selectFile = useCallback(
    (path: readonly string[] | undefined) => {
      if (!path || path.length === 0) {
        setValue(undefined);
        setImageUrl(undefined);
        return;
      }
      selectImage('file', path[0]);
    },
    [selectImage, setValue, setImageUrl]
  );

  useEffect(onChange, [onChange, value]);

  return {
    error,
    field,
    state,
    value,
    imageUrl,
    useVideoCover,
    useFile,
    selectFile,
  };
}

function isImageResultError(
  res: ImageToPrepareResult
): res is ImageToPrepareResultError {
  return (res as ImageToPrepareResultError).error !== undefined;
}
