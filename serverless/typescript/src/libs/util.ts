export const arrayChunk = <T>(array: T[], size = 1) =>
  array.reduce(
    (acc, _, index) => (index % size ? acc : [...acc, array.slice(index, index + size)]),
    [],
  );
