import { Permissions } from '@work-whiz/types';

interface IAdminQuery {
  id?: string;
  fristname?: string;
  lastName?: string;
  permissions?: Array<Permissions>;
  userId?: string;
}

export { IAdminQuery };
