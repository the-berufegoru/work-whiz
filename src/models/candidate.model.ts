import { DataTypes, Model, Association } from 'sequelize';
import { UserModel } from './user.model';
import { sequelize } from '@work-whiz/libs';
import { ICandidate } from '@work-whiz/interfaces';
import { TITLE_ENUM } from '@work-whiz/enums';

/**
 * Candidate database model representing job candidates
 * @class CandidateModel
 * @extends {Model<ICandidate>}
 * @implements {ICandidate}
 */
class CandidateModel extends Model<ICandidate> implements ICandidate {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public title?: (typeof TITLE_ENUM)[number];
  public skills?: string[];
  public isEmployed?: boolean;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: UserModel;

  public static associations: {
    user: Association<CandidateModel, UserModel>;
  };

  public static associate(models: { UserModel: typeof UserModel }) {
    CandidateModel.belongsTo(models.UserModel, {
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

CandidateModel.init(
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
    title: {
      type: DataTypes.ENUM(...TITLE_ENUM),
      allowNull: true,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    isEmployed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
    modelName: 'Candidate',
    tableName: 'Candidates',
    timestamps: true,
    indexes: [
      {
        name: 'candidates_userId_unique_idx',
        fields: ['userId'],
        unique: true,
      },
      {
        name: 'candidates_employment_status_idx',
        fields: ['isEmployed'],
        where: { isEmployed: true },
      },
      {
        name: 'candidates_skills_gin_idx',
        fields: ['skills'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
      {
        name: 'candidates_firstname_trgm_idx',
        fields: ['firstName'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
      {
        name: 'candidates_lastname_trgm_idx',
        fields: ['lastName'],
        using: 'GIN',
        operator: 'gin_trgm_ops',
      },
      {
        name: 'candidates_title_idx',
        fields: ['title'],
      },
      {
        name: 'candidates_created_at_idx',
        fields: ['createdAt'],
      },
      {
        name: 'candidates_name_composite_idx',
        fields: ['firstName', 'lastName'],
      },
    ],
  }
);

type CandidateWithUser = CandidateModel & {
  [CandidateModel.associationNames.user]: UserModel;
};

export { CandidateModel, TITLE_ENUM, CandidateWithUser };
