export interface MainSettingsOptions<S extends {}> {
  defaultValues?: S;
}

/**
 * Class that manages settings in the main process
 * - Load/save from storage
 * - Serve initial state to the renderer
 * - Get updates from the renderer
 * - Settings upgrades between versions
 */
export class MainSettings<S extends {}> {
  private readonly values: Map<keyof S, S[keyof S]> = new Map();

  public constructor({ defaultValues }: MainSettingsOptions<S>) {
    this.values = defaultValues
      ? new Map(Object.entries(defaultValues))
      : new Map();
  }

  public async load(): Promise<Readonly<S>> {
    return Object.fromEntries(this.values) as S;
  }

  // public async save(): Promise<void> {}

  public set<K extends keyof S>(key: K, value: S[K]): void {
    this.values.set(key, value);
  }

  public get<K extends keyof S>(key: K): S[K] | undefined {
    return this.values.get(key) as S[K];
  }

  public delete<K extends keyof S>(key: K): void {
    this.values.delete(key);
  }

  // protected async upgrade(): Promise<void> {}
}
