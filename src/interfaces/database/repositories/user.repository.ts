import { IUser } from '../models/user';
import { IUserQuery } from '../queries/user.query';
import { Transaction } from 'sequelize';

export interface IUserRepository {
  create(user: Omit<IUser, 'id'>): Promise<IUser>;
  read(query: IUserQuery): Promise<IUser | null>;
  readAll(
    query: IUserQuery,
    options: {
      page: number;
      limit: number;
      sort?: Record<string, 'ASC' | 'DESC'>;
    }
  ): Promise<{ users: IUser[]; total: number }>;
  update(id: string, data: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;

  // Transaction Support
  withTransaction(t: Transaction): IUserRepository;
}
