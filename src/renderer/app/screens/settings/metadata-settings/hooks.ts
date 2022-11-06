import { ChangeEvent } from 'react';
import { useSettings } from '@renderer/jotai/settings';

export function useMetadataSettings() {
  const { getSetting, updateSetting } = useSettings();

  function updateMaxBytes(ev: ChangeEvent<HTMLInputElement>): void {
    const n = Number(ev.target.value);
    if (Number.isNaN(n)) return;
    updateSetting('downloads.audio.metadata.image.maxBytes', n * 1000);
  }

  function updateResizeEnabled(ev: ChangeEvent<HTMLInputElement>): void {
    updateSetting(
      'downloads.audio.metadata.image.resize.enabled',
      ev.target.checked
    );
  }

  function updateResizeType(ev: ChangeEvent<HTMLSelectElement>): void {
    updateSetting(
      'downloads.audio.metadata.image.resize.type',
      ev.target.value as 'contain' | 'cover'
    );
  }

  function updateWidth(ev: ChangeEvent<HTMLInputElement>): void {
    const n = Number(ev.target.value);
    if (Number.isNaN(n)) return;
    updateSetting('downloads.audio.metadata.image.resize.width', n);
  }

  function updateHeight(ev: ChangeEvent<HTMLInputElement>): void {
    const n = Number(ev.target.value);
    if (Number.isNaN(n)) return;
    updateSetting('downloads.audio.metadata.image.resize.height', n);
  }

  const initialMaxBytes =
    getSetting('downloads.audio.metadata.image.maxBytes') / 1000;
  const initialResizeEnabled = getSetting(
    'downloads.audio.metadata.image.resize.enabled'
  );
  const initialResizeType = getSetting(
    'downloads.audio.metadata.image.resize.type'
  );
  const initialResizeWidth = getSetting(
    'downloads.audio.metadata.image.resize.width'
  );
  const initialResizeHeight = getSetting(
    'downloads.audio.metadata.image.resize.height'
  );

  return {
    initialMaxBytes,
    initialResizeEnabled,
    initialResizeType,
    initialResizeWidth,
    initialResizeHeight,
    updateMaxBytes,
    updateResizeEnabled,
    updateResizeType,
    updateWidth,
    updateHeight,
  };
}
