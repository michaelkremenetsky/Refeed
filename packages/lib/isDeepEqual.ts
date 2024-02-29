import {
  compareArrayBuffers,
  compareArrays,
  compareDataViews,
  compareDates,
  compareMaps,
  compareObjects,
  compareRegexps,
  compareSets,
} from "./compare";

/* eslint-disable */

// Taken from https://github.com/react-hookz/deep-equal/blob/master/src/index.ts
export const isDeepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (a && b && typeof a === "object" && typeof b === "object") {
    const ctor = a.constructor;

    if (ctor !== b.constructor) return false;

    if (ctor === Array) return compareArrays(a, b, isDeepEqual);

    if (ctor === Date) return compareDates(a, b);

    if (ctor === RegExp) return compareRegexps(a, b);

    if (ctor === Map && a instanceof Map && b instanceof Map)
      return compareMaps(a, b, isDeepEqual);

    if (ctor === Set && a instanceof Set && b instanceof Set)
      return compareSets(a, b);

    if (ctor === DataView) return compareDataViews(a, b);

    if (ctor === ArrayBuffer) {
      return compareArrayBuffers(new Uint8Array(a), new Uint8Array(b));
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      return compareArrayBuffers(a as any, b as any);
    }

    if (a.toString !== toString) return a.toString() === b.toString();

    return compareObjects(a, b, isDeepEqual);
  }

  return a !== a && b !== b;
};
