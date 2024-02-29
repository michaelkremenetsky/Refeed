// @ts-nocheck

export function levenshteinDistance(s: string, t: string): number {
  if (s.length === 0) return t.length;
  if (t.length === 0) return s.length;

  const matrix = [];

  // Increment along the first column of each row
  for (let i = 0; i <= t.length; i++) {
    matrix[i] = [i];
  }

  // Increment each column in the first row
  for (let j = 0; j <= s.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= t.length; i++) {
    for (let j = 1; j <= s.length; j++) {
      if (t.charAt(i - 1) == s.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1,
          ),
        ); // deletion
      }
    }
  }

  return matrix[t.length][s.length];
}
