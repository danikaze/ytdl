type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type Nullable<T extends {}> = { [key in keyof T]: T[key] | null };
