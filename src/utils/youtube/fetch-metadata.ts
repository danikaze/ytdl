import { spawn } from 'child_process';
import { YoutubeDlMetadata } from './types';
import { getExePath } from './utils/get-exe-path';

// TODO: Use real cache with TTL, etc.
// store it or lose it on app close?
// button to clear it manually?
const cachedMetadata = new Map<string, YoutubeDlMetadata>();

export function fetchMetadata(url: string): Promise<YoutubeDlMetadata> {
  const cachedData = cachedMetadata.get(url);
  if (cachedData) return Promise.resolve(cachedData);

  return new Promise<YoutubeDlMetadata>((resolve, reject) => {
    const exePath = getExePath();
    const args = ['-j', url];
    const child = spawn(exePath, args);

    let data = '';

    child.stdout.on('data', (dataBuffer) => {
      data += String(dataBuffer);
    });

    child.stderr.on('data', (dataBuffer) => {
      const errorMsg = String(dataBuffer);
      reject(errorMsg);
    });

    child.on('close', () => {
      try {
        const metadata = JSON.parse(data) as YoutubeDlMetadata;
        resolve(metadata);
        cachedMetadata.set(url, metadata);
      } catch (e) {
        reject(e);
      }
    });
  });
}
