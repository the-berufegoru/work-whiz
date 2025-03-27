import { IAdmin, IUser } from '@work-whiz/interfaces/database';

type SafeUser = Omit<IUser, 'password'>;

export const toAdminDto = (
  admin: Partial<IAdmin>
): Omit<IAdmin, 'user'> & {
  user?: SafeUser;
} => ({
  id: admin.id ?? '',
  firstName: admin.firstName ?? undefined,
  lastName: admin.lastName ?? undefined,
  permissions: admin.permissions ?? [],
  user: admin.user
    ? (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = admin.user;
        return safeUser as SafeUser;
      })()
    : undefined,
  createdAt: admin.createdAt ?? new Date(0),
  updatedAt: admin.updatedAt ?? new Date(0),
});
