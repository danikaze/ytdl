export function withoutExtension(filename: string): string {
  const i = filename.lastIndexOf('.');
  return filename.substring(0, i === -1 ? filename.length : i);
}
