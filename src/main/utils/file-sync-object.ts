import fs, { existsSync } from 'fs';
import { assignDeepWithDelete } from '../../utils/assign-deep';

export interface FileSyncObjectOptions<T extends {}> {
  /** ms to throttle the update to disc */
  updateThrottle?: number;
  /** When `true`, sync will be called again after `throttleTime` */
  prettify?: boolean;
  /** Data to initialize the file if it doesn't exist first */
  initialData?: T;
  /** If `true` and the file doesn't exist, throws an error */
  throwIfNotExists?: boolean;
  /** If provided, the callback will be called before writing to disk */
  beforeSync?: (data: T) => void;
}

export interface FileSyncObject<T extends {}> {
  data: DeepReadonly<T>;
  update: (data: DeepNullable<DeepPartial<T>>) => void;
}

export function createFileSyncObject<T extends {}>(
  path: string,
  options?: FileSyncObjectOptions<T>
): FileSyncObject<T> {
  return new RawFileSyncObject<T>(
    path,
    options
  ) as unknown as FileSyncObject<T>;
}

class RawFileSyncObject<T extends {}> {
  private options: FileSyncObjectOptions<T> &
    Required<Pick<FileSyncObjectOptions<T>, 'updateThrottle'>>;

  /** Path of the file to sync */
  private path: string;

  /** Current state of the data */
  public data: T;

  /** timestamp of the last sync on disk */
  private lastSync = 0;

  /** `true` while writing in the file, like a semaphore */
  private writing = false;

  /** Handler of `setTimeout` to schedule the next sync */
  private schedule?: ReturnType<typeof setTimeout>;

  /** When `true`, sync will be called again after `throttleTime` */
  private moreChanges = false;

  public constructor(path: string, options?: FileSyncObjectOptions<T>) {
    this.options = {
      updateThrottle: 5000,
      ...options,
    };

    this.path = path;
    this.data = this.read();

    this.store = this.store.bind(this);
  }

  public update(data: DeepPartial<T>): void {
    assignDeepWithDelete(this.data, data);
    this.store(false);
  }

  private read(): T {
    let data: T;

    if (this.options.throwIfNotExists && !existsSync(this.path)) {
      throw new Error(`File doesn't exist: ${this.path}`);
    }

    try {
      data = JSON.parse(fs.readFileSync(this.path).toString()) as T;
    } catch {
      data = this.options.initialData || ({} as T);
    }

    return data;
  }

  private async store(isScheduled: boolean): Promise<void> {
    if (!isScheduled) {
      // if the sync is already scheduled, just wait
      if (this.schedule) return;

      // if it's already being written, note that there are more changes after this
      if (this.writing) {
        this.moreChanges = true;
        return;
      }
    }

    // if the last sync was too recent, schedule the next one based on the throttle
    const diff = this.lastSync + this.options.updateThrottle - Date.now();
    if (diff > 0) {
      this.schedule = setTimeout(this.store, diff, true);
      return;
    }

    this.lastSync = Date.now();
    this.schedule = undefined;
    this.moreChanges = false;
    this.writing = true;
    await this.sync();
    this.writing = false;

    if (this.moreChanges) {
      this.schedule = setTimeout(this.store, this.options.updateThrottle, true);
    }
  }

  private async sync(): Promise<void> {
    this.options.beforeSync?.(this.data);

    const content = this.options.prettify
      ? JSON.stringify(this.data, null, 2)
      : JSON.stringify(this.data);
    return fs.promises.writeFile(this.path, content);
  }
}
