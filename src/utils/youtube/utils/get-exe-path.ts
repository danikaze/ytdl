import { existsSync } from 'fs';
import { join } from 'path';
import { mainSettings } from '../../../main/settings';

export function getExePath(): string {
  const version = mainSettings.get('youtubeDlVersion');

  if (!version) {
    throw new Error('youtubeDlVersion is not defined');
  }

  const VERSION = '{{VERSION}}';
  const filename = `youtube-dl-${VERSION}.exe`;
  const folder =
    process.env.NODE_ENV === 'development'
      ? 'assets/bin'
      : 'resources/assets/bin';

  const exePath = join(folder, filename).replace(VERSION, version);

  if (!existsSync(exePath)) {
    throw new Error(
      `youtubeDlVersion "${version}" not found in "{${exePath}}"`
    );
  }

  return exePath;
}
