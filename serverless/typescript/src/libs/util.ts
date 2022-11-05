export const arrayChunk = <T>(array: T[], size = 1) =>
  array.reduce(
    (acc, _, index) => (index % size ? acc : [...acc, array.slice(index, index + size)]),
    [],
  );

export const objectFilter = <T>(objectArray: T[], keys: string[]): T[] =>
  objectArray.filter(
    (value, index, self) =>
      index === self.findIndex((t) => keys.every((key) => t[key] === value[key])),
  );
