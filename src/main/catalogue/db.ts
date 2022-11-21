import { join } from 'path';
import { nanoid } from '../../npm/nanoid';
import { Download, DownloadState } from '../../interfaces/download';
import {
  createFileSyncObject,
  FileSyncObject,
} from '../utils/file-sync-object';

export interface CatalogueDbOptions {
  path: string;
}

interface CatalogueDbData {
  version: number;
  createdOn: string;
  updatedOn: string;
  downloads: Record<Download['id'], Download>;
}

export class CatalogueDb {
  private static VERSION = 1;

  private path: string;

  private db: FileSyncObject<CatalogueDbData>;

  constructor({ path }: CatalogueDbOptions) {
    this.path = join(path, 'db');
    this.db = createFileSyncObject(this.path, {
      prettify: true,
      initialData: {
        version: CatalogueDb.VERSION,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
        downloads: {},
      },
      beforeSync: (data) => {
        data.updatedOn = new Date().toISOString();
      },
    });
  }

  public async upgrade(): Promise<void> {
    const { version } = this.db.data;

    // init version
    if (!this.db.data.version) {
      this.db.data.version = CatalogueDb.VERSION;
    }
    if (!this.db.data.downloads) {
      this.db.data.downloads = {};
    }

    if (this.db.data.version === CatalogueDb.VERSION) return;

    console.log(
      `Updating CatalogueDB from ${version} to ${CatalogueDb.VERSION}`
    );

    this.db.update({ version: CatalogueDb.VERSION });
  }

  public getAllDownloads(): DeepReadonly<Download[]> {
    return Object.values(this.db.data.downloads);
  }

  public getDownload(id: Download['id']): Download | undefined {
    return this.db.data.downloads[id];
  }

  public addDownload(
    download: Pick<Download, 'url' | 'postProcess' | 'format'>
  ): Download['id'] {
    const id = nanoid();
    this.db.update({
      downloads: {
        [id]: {
          id,
          downloadPctg: 0,
          temporalFile: '',
          state: DownloadState.INITIALIZATING,
          ...download,
        },
      },
    });

    return id;
  }

  public updateDownload(
    download: Pick<Download, 'id'> & Nullable<Partial<Omit<Download, 'id'>>>
  ): void {
    const { id } = download;
    if (!id) {
      console.log(`Tried to update an unknown download with id: ${id}`);
      return;
    }

    this.db.update({
      downloads: {
        [id]: {
          ...this.db.data.downloads[id],
          ...download,
        },
      },
    });
  }

  public removeDownload(id: Download['id']): void {
    delete this.db.data.downloads[id];
    this.db.update({});
  }
}
