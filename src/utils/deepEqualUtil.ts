function deepEqualUtil<T extends Record<string, unknown>>(obj1: T, obj2: T): boolean {
  if (obj1 === obj2) return true;

  if (obj1 == null || typeof obj1 !== 'object' ||
    obj2 == null || typeof obj2 !== 'object') {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;

    const val1 = obj1[key as keyof T];
    const val2 = obj2[key as keyof T];

    // 如果值是对象，则递归比较
    const areObjects = typeof val1 === "object" && val1 !== null && typeof val2 === "object" && val2 !== null;
    if (areObjects) {
      if (!deepEqualUtil(val1 as Record<string, unknown>, val2 as Record<string, unknown>)) {
        return false;
      }
    } else if (val1 !== val2) {
      // 非对象，直接比较值
      return false;
    }
  }

  return true;
}

export default deepEqualUtil;
