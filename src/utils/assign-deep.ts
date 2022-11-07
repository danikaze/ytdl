/**
 * Like `Object.assign` but works in deep with objects
 *
 * @param args List of objects to extend. Use a new object `{}` as the
 * first argument to clone
 */
function baseAssignDeep<T>(
  nullDeletes: boolean,
  ...args: Partial<T>[]
): Partial<T> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable eqeqeq */
  let target = args[0];

  if (!isObject(target)) {
    target = {};
  }

  for (let i = 1; i < args.length; i++) {
    const source = args[i];

    if (source == undefined) {
      continue;
    }

    // extend the target
    Object.keys(source).forEach((key) => {
      const value = source[key as keyof T];

      if (nullDeletes && value === null) {
        delete target[key as keyof T];
        return;
      }

      // prevent infinite loops
      if (value === target) return;
      if (value === undefined) return;

      if (isObject(value) && !isFunction(value)) {
        (target as any)[key] = baseAssignDeep(
          nullDeletes,
          target[key as keyof T]!,
          value
        );
        // ignore undefined values (will copy null ones)
      } else {
        (target as any)[key] = value;
      }
    });
  }

  return target;
}

export function assignDeep<T>(...args: Partial<T>[]): Partial<T> {
  return baseAssignDeep(false, ...args);
}

export function assignDeepWithDelete<T>(...args: Partial<T>[]): Partial<T> {
  return baseAssignDeep(true, ...args);
}

const { toString } = Object.prototype;

function isObject(value: unknown): value is object {
  const type = typeof value;
  return (
    value != null &&
    (type === 'object' || type === 'function') &&
    toString.call(value) !== '[obejct Array]'
  );
}

function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}
