type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type DeepReadonly<T> = T extends object
  ? {
      [P in keyof T]: DeepReadonly<T[P]>;
    }
  : Readonly<T>;

type Nullable<T extends {}> = {
  [K in keyof T]: T[K] | null;
};

type DeepNullable<T> = T extends object
  ? {
      [K in keyof T]: DeepNullable<T[K]> | null;
    }
  : T | null;

type KeysOfWithValue<O extends {}, T> = Exclude<
  {
    [K in keyof O]: O[K] extends T ? K : never;
  }[keyof O],
  undefined
>;
