export const validateExpired = (date?: Date | string | null) =>
  Boolean(date && new Date(date) < new Date());
