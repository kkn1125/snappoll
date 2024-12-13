export const isNil = function <T>(value: T): value is undefined | null {
  return typeof value === 'undefined' || value === null;
};
