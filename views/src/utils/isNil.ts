export const isNil = (value: any): value is undefined | null =>
  typeof value === 'undefined' || value === null;
