export const getUsernameOrGuest = (username?: string) => {
  return username || '게스트';
};
