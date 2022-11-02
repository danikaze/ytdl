export function removeFromArray<T>(array: T[], item: T): boolean {
  const itemIndex = array.indexOf(item);
  if (itemIndex === -1) return false;
  array.splice(itemIndex, 1);
  return true;
}

export function removeFromArrayAndCopy<T>(array: T[], item: T): T[] {
  const itemIndex = array.indexOf(item);
  if (itemIndex === -1) return array;
  const copy = [...array];
  copy.splice(itemIndex, 1);
  return copy;
}
