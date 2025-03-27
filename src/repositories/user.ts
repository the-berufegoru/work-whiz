import { Op, WhereOptions, Transaction } from 'sequelize';
import { sequelize } from '@work-whiz/libs';
import { UserModel } from '@work-whiz/models';
import { IUser, IUserQuery, IUserRepository } from '@work-whiz/interfaces';
import { toIUserDTO } from '@work-whiz/dtos';
import { RepositoryError } from '@work-whiz/errors';

/**
 * User repository handling all database operations for User entities
 * @implements {IUserRepository}
 */
class UserRepository implements IUserRepository {
  private static instance: UserRepository;
  protected userModel: typeof UserModel;
  protected transaction?: Transaction;

  /**
   * Builds Sequelize where clause from query object
   * @private
   * @param {IUserQuery} query - The query parameters
   * @returns {WhereOptions} Sequelize where options
   */
  private readonly buildWhereClause = (query: IUserQuery): WhereOptions => {
    const where: WhereOptions = {};

    if (query.id) {
      where.id = { [Op.eq]: query.id };
    }

    if (query.email) {
      where.email = {
        [Op.eq]: query.email.toLowerCase(),
      };
    }

    if (typeof query.isActive === 'boolean') {
      where.isActive = { [Op.eq]: query.isActive };
    }

    if (typeof query.isVerified === 'boolean') {
      where.isVerified = { [Op.eq]: query.isVerified };
    }

    return where;
  };

  /**
   * Gets options object including transaction if available
   * @private
   * @returns {object} Sequelize options object
   */
  private getOptions() {
    return this.transaction ? { transaction: this.transaction } : {};
  }

  constructor() {
    this.userModel = UserModel;
  }

  /**
   * Creates a new repository instance bound to a transaction
   * @param {Transaction} transaction - Sequelize transaction
   * @returns {UserRepository} New repository instance with transaction
   */
  public withTransaction(transaction: Transaction): UserRepository {
    const repository = new UserRepository();
    repository.userModel = this.userModel;
    repository.transaction = transaction;
    return repository;
  }

  /**
   * Gets singleton repository instance
   * @static
   * @returns {UserRepository} The repository instance
   */
  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  /**
   * Creates a new user
   * @param {Omit<IUser, 'id'>} user - User data without id
   * @returns {Promise<IUser>} The created user DTO
   * @throws {RepositoryError} If creation fails
   */
  public async create(user: Omit<IUser, 'id'>): Promise<IUser> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const newUser = await this.userModel.create(user, {
        ...this.getOptions(),
      });
      await transaction.commit();

      return toIUserDTO(newUser);
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Failed to create user', error);
    }
  }

  /**
   * Finds a single user matching query
   * @param {IUserQuery} query - Search criteria
   * @returns {Promise<IUser|null>} User DTO if found, null otherwise
   * @throws {RepositoryError} If query fails
   */
  public async read(query: IUserQuery): Promise<IUser | null> {
    try {
      const user = await this.userModel.findOne({
        where: this.buildWhereClause(query),
        ...this.getOptions(),
      });

      return user ? toIUserDTO(user) : null;
    } catch (error) {
      throw new RepositoryError('Failed to retrieve user:', error);
    }
  }

  /**
   * Finds paginated users matching query
   * @param {IUserQuery} query - Search criteria
   * @param {Object} options - Pagination options
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.limit - Items per page
   * @param {Object} [options.sort] - Sorting criteria {field: 'ASC'|'DESC'}
   * @returns {Promise<{users: IUser[], total: number}>} Paginated results
   * @throws {RepositoryError} If query fails
   */
  public async readAll(
    query: IUserQuery,
    options: {
      page: number;
      limit: number;
      sort?: Record<string, 'ASC' | 'DESC'>;
    }
  ): Promise<{ users: IUser[]; total: number }> {
    try {
      const users = await this.userModel.findAll({
        where: this.buildWhereClause(query),
        offset: (options.page - 1) * options.limit,
        limit: options.limit,
        order: options.sort
          ? Object.entries(options.sort)
          : [['createdAt', 'ASC']],
      });

      return {
        users: users.map((user) => toIUserDTO(user)),
        total: users.length,
      };
    } catch (error) {
      throw new RepositoryError('Failed to retrieve users: ', error);
    }
  }

  /**
   * Updates a user by ID
   * @param {string} id - User ID
   * @param {Partial<IUser>} data - Data to update
   * @returns {Promise<IUser|null>} Updated user DTO if found, null otherwise
   * @throws {RepositoryError} If update fails
   */
  public async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const whereClause = this.buildWhereClause({ id });
      const [affectedRows] = await this.userModel.update(data, {
        where: whereClause,
        transaction,
      });

      if (affectedRows > 0) {
        const updatedUser = await this.read({ id });
        await transaction.commit();
        return updatedUser ? toIUserDTO(updatedUser) : null;
      } else {
        await transaction.rollback();
        return null;
      }
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Failed to update user:', error);
    }
  }

  /**
   * Deletes a user by ID
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if user was deleted, false otherwise
   * @throws {RepositoryError} If deletion fails
   */
  public async delete(id: string): Promise<boolean> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const whereClause = this.buildWhereClause({ id });
      const deletedRows = await this.userModel.destroy({
        where: whereClause,
        transaction,
      });

      await transaction.commit();

      return deletedRows > 0;
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Failed to remove user', error);
    }
  }
}

export const userRepository = UserRepository.getInstance();
