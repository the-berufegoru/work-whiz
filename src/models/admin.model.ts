import { DataTypes, Model, Association } from 'sequelize';
import { UserModel } from './user.model';
import { sequelize } from '@work-whiz/libs';
import { IAdmin } from '@work-whiz/interfaces';
import { Permissions } from '@work-whiz/types';

/**
 * Admin database model representing system administrators
 * @class AdminModel
 * @extends {Model<IAdmin>}
 * @implements {IAdmin}
 */
class AdminModel extends Model<IAdmin> implements IAdmin {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public permissions!: Array<Permissions>;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: UserModel;

  public static associations: {
    user: Association<AdminModel, UserModel>;
  };

  public static associate(models: { UserModel: typeof UserModel }) {
    AdminModel.belongsTo(models.UserModel, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      hooks: true,
      constraints: true,
    });
  }

  public static associationNames = {
    user: 'user' as const,
  };
}

AdminModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(Permissions))),
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidPermissions(value: Permissions[]) {
          if (!Array.isArray(value)) {
            throw new Error('Permissions must be an array');
          }
          const invalid = value.filter(
            (p) => !Object.values(Permissions).includes(p)
          );
          if (invalid.length > 0) {
            throw new Error(`Invalid permissions: ${invalid.join(', ')}`);
          }
        },
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admins',
    timestamps: true,
    indexes: [
      {
        name: 'admins_userId_index',
        fields: ['userId'],
        unique: true,
      },
      {
        name: 'admins_permissions_gin_index',
        fields: ['permissions'],
        using: 'GIN',
      },
      {
        name: 'admins_firstname_trgm_idx',
        fields: ['firstName'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
      {
        name: 'admins_lastname_trgm_idx',
        fields: ['lastName'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
      {
        name: 'admins_name_composite_idx',
        fields: ['firstName', 'lastName'],
      },
      {
        name: 'admins_permission_exists_idx',
        fields: ['permissions'],
        using: 'GIN',
        where: sequelize.literal('array_length(permissions, 1) > 0'),
      },
    ],
  }
);

type AdminWithUser = AdminModel & {
  [AdminModel.associationNames.user]: UserModel;
};

export { AdminModel, AdminWithUser };
