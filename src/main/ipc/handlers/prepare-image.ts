import { basename } from 'path';
import { ImageToPrepare } from '../../../interfaces/download';
import { MainSettings } from '../../utils/settings';
import { prepareImage } from '../../utils/image';

export async function prepareImageHandler(
  mainSettings: MainSettings,
  data: ImageToPrepare
) {
  try {
    const imagePath = await prepareImage(data.from, data.path, {
      maxBytes: mainSettings.get('downloads.audio.metadata.image.maxBytes'),
      resize: {
        enabled: mainSettings.get(
          'downloads.audio.metadata.image.resize.enabled'
        ),
        type: mainSettings.get('downloads.audio.metadata.image.resize.type'),
        width: mainSettings.get('downloads.audio.metadata.image.resize.width'),
        height: mainSettings.get(
          'downloads.audio.metadata.image.resize.height'
        ),
      },
      filename: data.videoId,
    });
    return {
      path: imagePath,
      url: `thumb://${basename(imagePath)}?t=${Date.now()}`,
    };
  } catch (error) {
    return (error as Error).toString();
  }
}
