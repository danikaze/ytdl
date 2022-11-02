import { Promise as NodeID3 } from 'node-id3';
import { AudioProcessOptions } from '@interfaces/download';

export async function processAudio(
  filepath: string,
  process: AudioProcessOptions
): Promise<void> {
  if (process.metadata) {
    await NodeID3.write(process.metadata, filepath);
  }
}
