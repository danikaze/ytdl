import { getFilenameReservedRegex } from '@utils/is-valid-filename';
import { YoutubeDlMetadata } from '@utils/youtube/types';

type MetadataReplacer = (metadata: YoutubeDlMetadata) => string | undefined;

const replacers: Record<string, MetadataReplacer> = {
  '[id]': stringReplacer('id'),
  '[display_id]': stringReplacer('display_id'),
  '[webpage_url]': stringReplacer('webpage_url'),
  '[uploader]': stringReplacer('uploader'),
  '[uploader_id]': stringReplacer('uploader_id'),
  '[uploader_url]': stringReplacer('uploader_url'),
  '[upload_date]': stringReplacer('upload_date'),
  '[channel]': stringReplacer('channel'),
  '[channel_id]': stringReplacer('channel_id'),
  '[channel_url]': stringReplacer('channel_url'),
  '[thumbnail]': stringReplacer('thumbnail'),
  '[title]': stringReplacer('title'),
  '[fulltitle]': stringReplacer('fulltitle'),
  '[description]': stringReplacer('description'),
  // '[playlist]': stringReplacer('playlist'),
  '[ext]': stringReplacer('ext'),
  '[format]': stringReplacer('format'),
  '[format_id]': stringReplacer('format_id'),
  '[acodec]': stringReplacer('acodec'),
  '[vcodec]': stringReplacer('vcodec'),

  '[view_count]': numberReplacer('view_count'),
  '[age_limit]': numberReplacer('age_limit'),
  // '[playlist_index]': numberReplacer('playlist_index'),
  '[duration]': numberReplacer('duration'),
  '[fps]': numberReplacer('fps'),
  '[abr]': numberReplacer('abr'),
  '[vbr]': numberReplacer('vbr'),
  '[width]': numberReplacer('width'),
  '[height]': numberReplacer('height'),

  '[categories]': stringArrayReplacer('categories'),
  '[tags]': stringArrayReplacer('tags'),
};

export function replaceMetadata(
  template: string,
  metadata?: YoutubeDlMetadata,
  naValue = ''
): string {
  if (!metadata) return '';

  return template
    .replace(/(\\?\[[^\]]+\])/gi, (match) => {
      const replacer = replacers[match.toLowerCase()];
      if (!replacer) return match;
      if (match[0] === '\\') return match.substring(1);
      const value = replacer(metadata);
      return value ? toValidChars(value) : naValue;
    })
    .trim();
}

function stringReplacer(
  fieldName: KeysOfWithValue<YoutubeDlMetadata, string>
): MetadataReplacer {
  return (metadata) => metadata[fieldName];
}

function stringArrayReplacer(
  fieldName: KeysOfWithValue<YoutubeDlMetadata, string[]>
): MetadataReplacer {
  return (metadata) => metadata[fieldName]?.join(',');
}

function numberReplacer(
  fieldName: KeysOfWithValue<YoutubeDlMetadata, number>
): MetadataReplacer {
  return (metadata) => metadata[fieldName]?.toString();
}

function toValidChars(string: string, validChar = '_'): string {
  return string.replace(getFilenameReservedRegex(), validChar);
}
