import fs from 'fs';
import { Tags, Promise as NodeID3 } from 'node-id3';
import { AudioProcessOptions } from '@interfaces/download';

// https://en.wikipedia.org/wiki/ID3#ID3v2_embedded_image_extension
const IMAGE_ID_COVER_FRONT = 3;
// const IMAGE_ID_COVER_BACK = 4;

export async function processAudio(
  filepath: string,
  process: AudioProcessOptions
): Promise<void> {
  if (process.metadata) {
    const { frontCover, ...tags } = process.metadata;

    if (frontCover) {
      const imageBuffer = await fs.promises.readFile(frontCover);
      const mime = /\.jpe?g$/.test(frontCover) ? 'image/jpeg' : 'image/png';
      (tags as Tags).image = {
        mime,
        type: { id: IMAGE_ID_COVER_FRONT, name: 'Front Cover' },
        description: 'Added with ytdl',
        imageBuffer,
      };
    }

    await NodeID3.write(tags, filepath);
  }
}
