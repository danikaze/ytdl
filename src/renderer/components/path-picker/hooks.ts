import { useState } from 'react';
import type { Props } from '.';

export function usePathPicker({
  dialogOptions,
  disabled,
  defaultValue,
  onChange,
}: Props) {
  const [currentPath, setCurrentPath] = useState<string>(defaultValue || '');

  async function showPickDialog() {
    if (disabled) return;
    const paths = await window.ytdl.pickFile(dialogOptions);
    setCurrentPath(paths ? paths.join(', ') : '');
    onChange(paths);
  }

  return { currentPath, showPickDialog };
}
