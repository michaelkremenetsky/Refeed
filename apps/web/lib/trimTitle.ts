export function trimTitle(navTitle: string | undefined, maxLength: number) {
  return navTitle?.length! > maxLength
    ? navTitle?.substr(0, navTitle?.lastIndexOf(" ", maxLength))
    : navTitle;
}
