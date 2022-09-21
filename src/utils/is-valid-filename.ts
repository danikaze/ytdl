/*
 * Based on https://github.com/sindresorhus/filename-reserved-regex
 * and https://github.com/sindresorhus/valid-filename
 */

// eslint-disable-next-line no-control-regex
export const getFilenameReservedRegex = () => /[<>:"/\\|?*\u0000-\u001F]/g;
export const getWindowsReservedNameRegex = () =>
  /^(con|prn|aux|nul|com\d|lpt\d)$/i;

/**
 * Return if the given filename is valid in the current platform
 */
export function isValidFilename(filename: string): boolean {
  if (!filename || filename.length > 255) return false;
  if (filename === '.' || filename === '..') return false;
  if (
    getFilenameReservedRegex().test(filename) ||
    getWindowsReservedNameRegex().test(filename)
  ) {
    return false;
  }

  return true;
}
