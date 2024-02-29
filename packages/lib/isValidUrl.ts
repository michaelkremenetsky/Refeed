export function isValidHttpUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
}
