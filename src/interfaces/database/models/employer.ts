import { IUser } from './user';

interface IEmployer {
  readonly id?: string;
  name?: string;
  industry?: string;
  website_url?: string;
  location?: string;
  description?: string;
  size?: number;
  founded_in?: number;
  is_verified?: boolean;
  user?: IUser;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export { IEmployer };
