import { Permissions } from '@work-whiz/types';
import { IUser } from './user';

interface IAdmin {
  readonly id: string;
  firstName?: string;
  lastName?: string;
  permissions?: Array<Permissions>;
  user?: IUser;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export { IAdmin };
