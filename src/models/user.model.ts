import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@work-whiz/libs';
import { IUser } from '@work-whiz/interfaces';
import { Role } from '@work-whiz/types';
import { ROLE_ENUM } from '@work-whiz/enums';
import { AuthenticationModel } from './authentication.model';

/**
 * User database model representing system users
 * @class UserModel
 * @extends {Model<IUser>}
 * @implements {IUser}
 */
class UserModel extends Model<IUser> implements IUser {
  public id!: string;
  public avatarUrl?: string;
  public email!: string;
  public phone!: string;
  public password!: string;
  public role!: Role;
  public isVerified!: boolean;
  public isActive!: boolean;
  public isLocked!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Sets up model associations
   * @param models - Dictionary of model classes
   */
  public static associate(models: {
    AuthenticationModel: typeof AuthenticationModel;
  }) {
    UserModel.hasOne(models.AuthenticationModel, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      as: 'authentication',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      hooks: true,
      constraints: true,
    });
  }

  public static readonly associationNames = {
    authentication: 'authentication' as const,
  };
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: {
        isUUID: 4,
      },
    },
    avatarUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [5, 255],
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [8, 20],
      },
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [60, 60],
      },
    },
    role: {
      type: DataTypes.ENUM(...ROLE_ENUM),
      allowNull: false,
      defaultValue: 'candidate',
      validate: {
        notEmpty: true,
        isIn: [ROLE_ENUM],
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'users_email_index',
        fields: ['email'],
        unique: true,
      },
      {
        name: 'users_phone_index',
        fields: ['phone'],
        unique: true,
      },
      {
        name: 'users_role_filter_index',
        fields: ['role', 'isActive', 'isVerified', 'isLocked'],
      },
      {
        name: 'users_email_trgm_index',
        fields: ['email'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
      {
        name: 'users_phone_trgm_index',
        fields: ['phone'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
      {
        name: 'users_verification_status_index',
        fields: ['isVerified'],
        where: { isVerified: false },
      },
    ],
  }
);

type UserWithAuthentication = UserModel & {
  [UserModel.associationNames.authentication]: AuthenticationModel;
};

export { UserModel, UserWithAuthentication };
