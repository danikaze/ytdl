import fs, { statSync } from 'fs';
import sharp from 'sharp';
import got from 'got';
import mkdirp from 'mkdirp';
import { join } from 'path';
import { AudioProcessImageOptions } from '@interfaces/download';
import {
  THUMB_MAX_BYTES_DEFAULT,
  THUMB_TEMP_PATH,
} from '../../utils/constants';

export type PrepareImageOptions = AudioProcessImageOptions & {
  /** only filename, no extension, no path */
  filename: string;
};

export async function prepareImage(
  type: 'file' | 'url',
  path: string,
  options: PrepareImageOptions
): Promise<string> {
  const input = await (type === 'file'
    ? getImageFromFile(path)
    : getImageFromUrl(path));
  const process = sharp(input);

  if (options.resize) {
    process.resize({
      width: options.resize.width,
      height: options.resize.height,
      fit: options.resize.type,
    });
  }

  const outputPath = await saveToFile(
    process,
    options.filename,
    options.maxBytes
  );

  return outputPath;
}

async function getImageFromUrl(url: string): Promise<Buffer> {
  return got.get(url).buffer();
}

async function getImageFromFile(filepath: string): Promise<Buffer> {
  return fs.promises.readFile(filepath);
}

async function saveToFile(
  process: sharp.Sharp,
  filename: string,
  maxBytes?: number
): Promise<string> {
  await mkdirp(THUMB_TEMP_PATH);
  const maxSize = maxBytes === undefined ? THUMB_MAX_BYTES_DEFAULT : maxBytes;

  // try using PNG for the thumbnail within the size limits
  // if not possible, fallback to JPG
  try {
    const filepath = join(THUMB_TEMP_PATH, `${filename}.png`);
    await saveAsPng(process, filepath, maxSize);
    return filepath;
  } catch (e) {
    const filepath = join(THUMB_TEMP_PATH, `${filename}.png`);
    await saveAsJpg(process, filepath, maxSize);
    return filepath;
  }
}

async function saveAsJpg(
  process: sharp.Sharp,
  filename: string,
  maxBytes: number
): Promise<void> {
  let quality = 100;
  const limits = [5, 100];

  for (;;) {
    process.jpeg({ quality });
    // eslint-disable-next-line no-await-in-loop
    await process.toFile(filename);
    const { size } = statSync(filename);
    if (!maxBytes || size === maxBytes) break;

    if (limits[0] > limits[1]) {
      throw new Error(`Not able to save as jpg of less than ${maxBytes} bytes`);
    }

    let newQuality;
    if (size > maxBytes) {
      newQuality = Math.round((limits[0] + quality) / 2);
      limits[1] = quality;
    } else {
      newQuality = Math.round((quality + limits[1]) / 2);
      limits[0] = quality;
    }

    if (newQuality === limits[0] || newQuality === limits[1]) break;
    quality = newQuality;
  }
}

async function saveAsPng(
  process: sharp.Sharp,
  filename: string,
  maxBytes: number
): Promise<void> {
  process.png({ compressionLevel: 9 });
  await process.toFile(filename);

  const { size } = statSync(filename);
  if (maxBytes && size > maxBytes) {
    throw new Error(
      `Not able to save as png of less than ${maxBytes} bytes (${size} bytes)`
    );
  }
}
