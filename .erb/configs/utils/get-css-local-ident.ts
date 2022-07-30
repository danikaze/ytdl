import { createHash } from 'crypto';
import { sep } from 'path';

interface CssLoaderContextLike {
  context: string;
  resourcePath: string;
}

/* https://github.com/webpack-contrib/css-loader#modules */
export function getCssLocalIdent(
  context: CssLoaderContextLike,
  localIdentName: string,
  localName: string
): string {
  const HASH_LENGTH = 5;
  const hashContent = `filepath:${context.resourcePath}|classname:${localName}`;
  const filename = context.resourcePath
    .replace(`${context.context}`, '')
    .substring(1)
    .replace(sep, '-')
    .replace(/\.module\.s?[ca]ss/, '');
  const hash = createHash('md5')
    .update(hashContent)
    .digest('base64')
    .substring(0, HASH_LENGTH);

  return `${filename}__${localName}__${hash}`;
}
