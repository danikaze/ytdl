import { app } from 'electron';
import { existsSync } from 'fs';
import { join } from 'path';
import { sync as mkdirpSync } from 'mkdirp';
import { Download } from '../../interfaces/download';
import { CatalogueDb } from './db';

export interface CatalogueOptions {
  path?: string;
}

export class Catalogue {
  private path: string;

  private db!: CatalogueDb;

  constructor(options?: CatalogueOptions) {
    const { path } = {
      path: join(app.getPath('userData'), 'catalogue'),
      ...options,
    };
    this.path = path;
  }

  // eslint-disable-next-line consistent-return
  public async open(): Promise<void> {
    if (!existsSync(this.path)) {
      return this.createLibrary();
    }

    console.log(`Opening catalogue from ${this.path}`);
    this.db = new CatalogueDb({ path: this.path });

    await this.upgrade();
  }

  public getAllDownloads(): DeepReadonly<Download[]> {
    return this.db.getAllDownloads();
  }

  public getDownload(id: Download['id']): Download | undefined {
    return this.db.getDownload(id);
  }

  public addDownload(
    download: Pick<Download, 'url' | 'postProcess' | 'format'>
  ): Download['id'] {
    return this.db.addDownload(download);
  }

  public updateDownload(
    download: Pick<Download, 'id'> & Nullable<Partial<Omit<Download, 'id'>>>
  ): void {
    this.db.updateDownload(download);
  }

  public removeDownload(id: Download['id']): void {
    this.db.removeDownload(id);
  }

  private async createLibrary(): Promise<void> {
    console.log(`Creating new catalogue in ${this.path}`);

    mkdirpSync(this.path);
    this.db = new CatalogueDb({ path: this.path });
  }

  private async upgrade(): Promise<void> {
    await this.db!.upgrade();
  }
}
