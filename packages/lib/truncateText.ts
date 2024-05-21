export const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, text.length - 3) + "..."; // Subtract 3 to account for the ellipsis
  }
  return text;
};
