import { Download } from './download';

export interface AppUi {
  confirmDownloadId: Download['id'] | undefined;
}
