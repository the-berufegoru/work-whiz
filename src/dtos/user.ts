import { IUser } from '@work-whiz/interfaces';

const toIUserDTO = (user: IUser): IUser => ({
  id: user.id,
  avatarUrl: user.avatarUrl ?? undefined,
  email: user.email ?? undefined,
  phone: user.phone ?? undefined,
  password: user.password ?? undefined,
  role: user.role ?? undefined,
  isVerified: user.isVerified ?? false,
  isActive: user.isActive ?? false,
  createdAt: user.createdAt ?? new Date(),
  updatedAt: user.updatedAt ?? new Date(),
});

export { toIUserDTO };
