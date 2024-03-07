// Taken from https://github.com/kwunshing123/jaro-winkler-typescript/blob/master/src/index.ts

interface Options {
  caseSensitive: boolean;
}

/**
 *
 * @param str1 String 1 for compare
 * @param str2 String 2 for compare
 * @param options to control case sensitive or not
 */
export function jaro(str1: string, str2: string, options?: Options): number {
  // Exit early if either are empty.
  if (str1.length === 0 || str2.length === 0) {
    return 0;
  }

  // Convert to upper if case-sensitive is false.
  if (options && !options.caseSensitive) {
    str1 = str1.toUpperCase();
    str2 = str2.toUpperCase();
  }

  // Exact match
  if (str1 === str2) {
    return 1;
  }

  // Number of matches
  let m = 0;

  // Length of two Strings
  const len1: number = str1.length;
  const len2: number = str2.length;

  // Maximum distance
  const window: number = Math.floor(Math.max(len1, len2) / 2) - 1;

  // Hash for matches
  const str1Hash: boolean[] = new Array(len1);
  const str2Hash: boolean[] = new Array(len2);

  for (let i = 0; i < len1; i++) {
    for (
      let j = Math.max(0, i - window);
      j <= Math.min(len2, i + window + 1);
      j++
    ) {
      if (!str1Hash[i] && !str2Hash[j] && str1[i] === str2[j]) {
        ++m;
        str1Hash[i] = str2Hash[j] = true;
        break;
      }
    }
  }

  // Exit early if no matches were found.
  if (m === 0) {
    return 0;
  }

  // Count the transpositions.
  let t = 0;
  let point = 0;

  for (let i = 0; i < len1; i++) {
    if (str1Hash[i]) {
      while (!str2Hash[point]) {
        point++;
      }

      if (str1.charAt(i) !== str2.charAt(point++)) {
        t++;
      }
    }
  }

  t /= 2;

  return (m / len1 + m / len2 + (m - t) / m) / 3;
}

/**
 *
 * @param str1 String 1 for compare
 * @param str2 String 2 for compare
 * @param options to control case sensitive or not
 */
export function JaroWinklerDistance(
  str1: string,
  str2: string,
  options?: Options,
): number {
  // Jaro Distance
  let jaroDist: number = jaro(str1, str2, options);
  // Same prefix length, maxium is 4
  let prefix = 0;

  if (jaroDist > 0.7) {
    const minIndex = Math.min(str1.length, str2.length);
    let i = 0;
    while (str1[i] === str2[i] && i < 4 && i < minIndex) {
      ++prefix;
      i++;
    }

    jaroDist += 0.1 * prefix * (1 - jaroDist);
  }

  return jaroDist;
}
