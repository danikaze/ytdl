export function removeFromArray<T>(array: T[], item: T): boolean {
  const itemIndex = array.indexOf(item);
  if (itemIndex === -1) return false;
  array.splice(itemIndex, 1);
  return true;
}
