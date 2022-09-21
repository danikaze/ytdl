type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type Nullable<T extends {}> = { [key in keyof T]: T[key] | null };

type KeysOfWithValue<O extends {}, T> = Exclude<
  {
    [K in keyof O]: O[K] extends T ? K : never;
  }[keyof O],
  undefined
>;
