//Returns the differences between two objects, including nested objects. Only properties that are different in b compared to a will be included in the result.
export function diff<T extends object>(a: T, b: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key in b) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) continue;

    const aVal = a[key];
    const bVal = b[key];

    const bothObjects =
      typeof aVal === 'object' &&
      typeof bVal === 'object' &&
      aVal !== null &&
      bVal !== null;

    if (bothObjects) {
      const nested = diff(aVal as any, bVal as any);
      if (Object.keys(nested).length > 0) {
        result[key] = nested as any;
      }
    } else if (aVal !== bVal) {
      result[key] = bVal;
    }
  }

  return result;
}
