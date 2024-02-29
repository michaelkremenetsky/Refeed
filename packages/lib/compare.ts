// Taken from https://github.com/react-hookz/deep-equal/blob/master/src/comparators.ts
// @ts-nocheck
/* eslint-disable */

type EqualFn = (a: any, b: any) => boolean;

export const compareDates = (a: Date, b: Date): boolean =>
  a.getTime() === b.getTime();

export const compareRegexps = (a: RegExp, b: RegExp): boolean =>
  a.source === b.source && a.flags === b.flags;

export const compareArrays = (a: any[], b: any[], equal: EqualFn): boolean => {
  let l = a.length;
  if (l !== b.length) return false;

  while (l-- && equal(a[l], b[l]));

  return l === -1;
};

export const compareMaps = (
  a: Map<any, any>,
  b: Map<any, any>,
  equal: EqualFn,
): boolean => {
  if (a.size !== b.size) return false;
  const it = a.entries();
  let i: any;

  while (!(i = it.next()).done) {
    if (!b.has(i.value[0]) || !equal(i.value[1], b.get(i.value[0])))
      return false;
  }

  return true;
};

export const compareSets = (a: Set<any>, b: Set<any>): boolean => {
  if (a.size !== b.size) return false;
  const it = a.values();
  let i: any;

  while (!(i = it.next()).done) {
    if (!b.has(i.value)) return false;
  }

  return true;
};

export const compareDataViews = (a: DataView, b: DataView): boolean => {
  let l = a.byteLength;
  if (l !== b.byteLength) return false;

  while (l-- && a.getInt8(l) === b.getInt8(l));

  return l === -1;
};

export const compareArrayBuffers = (
  a: ArrayLike<any>,
  b: ArrayLike<any>,
): boolean => {
  let l = a.length;
  if (l !== b.length) return false;

  while (l-- && a[l] === b[l]);

  return l === -1;
};

const { hasOwnProperty } = Object.prototype;
const oKeys = Object.keys;

export const compareObjects = (
  a: Record<any, any>,
  b: Record<any, any>,
  equal: EqualFn,
): boolean => {
  let i;
  let len = 0;

  for (i in a) {
    if (hasOwnProperty.call(a, i)) {
      len++;

      if (!hasOwnProperty.call(b, i)) return false;

      if (!equal(a[i], b[i])) return false;
    }
  }

  return oKeys(b).length === len;
};

export const compareObjectsReact = (
  a: Record<any, any>,
  b: Record<any, any>,
  equal: EqualFn,
): boolean => {
  let i;
  let len = 0;

  for (i in a) {
    if (hasOwnProperty.call(a, i)) {
      len++;
      if (a.$$typeof && (i === "_owner" || i === "__v" || i === "__o")) {
        // in React and Preact these properties contain circular references
        // .$$typeof is just reasonable marker of element

        continue;
      }

      if (!hasOwnProperty.call(b, i)) return false;

      if (!equal(a[i], b[i])) return false;
    }
  }

  return oKeys(b).length === len;
};
