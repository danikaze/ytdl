export function removeFromArray<T>(
  array: T[],
  item: T | Parameters<Array<T>['findIndex']>[0]
): boolean {
  const itemIndex =
    typeof item === 'function'
      ? array.findIndex(item as Parameters<Array<T>['findIndex']>[0])
      : array.indexOf(item);
  if (itemIndex === -1) return false;
  array.splice(itemIndex, 1);
  return true;
}

export function removeFromArrayAndCopy<T>(
  array: T[],
  item: T | Parameters<Array<T>['findIndex']>[0]
): T[] {
  const itemIndex =
    typeof item === 'function'
      ? array.findIndex(item as Parameters<Array<T>['findIndex']>[0])
      : array.indexOf(item);
  if (itemIndex === -1) return array;
  const copy = [...array];
  copy.splice(itemIndex, 1);
  return copy;
}
