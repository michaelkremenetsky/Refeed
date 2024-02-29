export function divideArray<T>(inputArray: T[], chunkSize: number): T[][] {
  const numOfChunks = Math.ceil(inputArray.length / chunkSize);
  return Array.from({ length: numOfChunks }, (_, i) =>
    inputArray.slice(i * chunkSize, i * chunkSize + chunkSize),
  );
}
