import type { Settings } from '@interfaces/settings';
import { store } from '../storage';

export interface MainSettingsOptions {
  defaultValues: Readonly<Settings>;
}

/**
 * Class that manages settings in the main process
 * - Load/save from storage
 * - Serve initial state to the renderer
 * - Get updates from the renderer
 * - Settings upgrades between versions
 */
export class MainSettings {
  private readonly defaultValues: Readonly<Settings>;

  private values: Settings;

  public constructor({ defaultValues }: MainSettingsOptions) {
    this.defaultValues = defaultValues;
    this.values = { ...defaultValues };
  }

  public async load(): Promise<Readonly<Settings>> {
    const loadedSettings = store.get('settings', this.defaultValues);
    this.values = loadedSettings;
    return loadedSettings;
  }

  public async save(): Promise<void> {
    store.set('settings', this.values);
  }

  public set<K extends keyof Settings>(key: K, value: Settings[K]): void {
    this.values[key] = value;
  }

  public get<K extends keyof Settings>(key: K): Settings[K] {
    return this.values[key] || this.defaultValues[key];
  }

  public delete<K extends keyof Settings>(key: K): void {
    delete this.values[key];
  }
}
