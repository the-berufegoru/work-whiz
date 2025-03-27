import { Permissions } from '@work-whiz/types';

interface IAdminQuery {
  firstName: string;
  lastNamek: string;
  permissions: Array<Permissions>;
}

export { IAdminQuery };
