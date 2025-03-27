import { IUser } from './user';

interface ISeeker {
  readonly id?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  skills?: Array<string>;
  is_employed?: boolean;
  user_id?: string;
  user?: IUser;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export { ISeeker };
