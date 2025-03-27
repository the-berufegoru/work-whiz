import { Role } from '@work-whiz/types/roles';

interface IUser {
  id: string;
  avatarUrl: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { IUser };
