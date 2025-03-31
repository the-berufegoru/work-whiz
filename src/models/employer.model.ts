import { DataTypes, Model, Association, Op } from 'sequelize';
import { UserModel } from './user.model';
import { sequelize } from '@work-whiz/libs';
import { IEmployer, IModelDictionary } from '@work-whiz/interfaces';

/**
 * Employer database model representing companies/organizations
 * @class EmployerModel
 * @extends {Model<IEmployer>}
 * @implements {IEmployer}
 */
class EmployerModel extends Model<IEmployer> implements IEmployer {
  public id!: string;
  public name!: string;
  public industry!: string;
  public websiteUrl?: string;
  public location?: string;
  public description?: string;
  public size?: number;
  public foundedIn?: number;
  public isVerified?: boolean;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: UserModel;

  public static associations: {
    user: Association<EmployerModel, UserModel>;
  };

  public static associate(models: IModelDictionary) {
    EmployerModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  }

  public static associationNames = {
    user: 'user' as const,
  };
}

EmployerModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 2000],
      },
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    foundedIn: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1800,
        max: new Date().getFullYear(),
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Employer',
    tableName: 'Employers',
    timestamps: true,
    indexes: [
      {
        name: 'employers_userId_unique_idx',
        fields: ['userId'],
        unique: true,
      },
      {
        name: 'employers_name_trgm_idx',
        fields: ['name'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
      {
        name: 'employers_industry_partial_idx',
        fields: ['industry'],
        where: { industry: { [Op.not]: null } },
      },
      {
        name: 'employers_size_idx',
        fields: ['size'],
      },
      {
        name: 'employers_verified_status_idx',
        fields: ['isVerified'],
        where: { isVerified: true },
      },
      {
        name: 'employers_location_trgm_idx',
        fields: ['location'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
      {
        name: 'employers_industry_size_composite_idx',
        fields: ['industry', 'size'],
      },
      {
        name: 'employers_description_trgm_idx',
        fields: ['description'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
    ],
  }
);

type EmployerWithUser = EmployerModel & {
  [EmployerModel.associationNames.user]: UserModel;
};

export { EmployerModel, EmployerWithUser };
