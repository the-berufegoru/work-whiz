import { Role } from '@work-whiz/types/roles';

interface IUserQuery {
  id?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
  isVerified?: boolean;
}

export { IUserQuery };
