import { app } from 'electron';
import { join } from 'path';

export const THUMB_TEMP_PATH = join(app.getAppPath(), 'thumbs');
