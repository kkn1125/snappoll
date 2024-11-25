export const Role = {
  Admin: 'Admin',
  User: 'User',
} as const;
export type Role = (typeof Role)[keyof typeof Role];
