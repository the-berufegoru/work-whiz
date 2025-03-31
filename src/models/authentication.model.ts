import { Association, DataTypes, Model } from 'sequelize';
import { sequelize } from '@work-whiz/libs';
import { IAuthentication } from '@work-whiz/interfaces';
import { UserModel } from './user.model';

class AuthenticationModel
  extends Model<IAuthentication>
  implements IAuthentication
{
  public id!: string;
  public mfaEnabled!: boolean;
  public mfaSecret?: string;
  public mfaRecoveryCodes?: string[];
  public otpSecret?: string;
  public otpExpiresAt?: Date;
  public lastOtpAttempt?: Date;
  public otpAttemptCount!: number;
  public readonly userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    user: Association<AuthenticationModel, UserModel>;
  };

  /**
   * Sets up associations between Authentication and User models
   * @param models - Dictionary of model classes
   */
  public static associate(models: { UserModel: typeof UserModel }) {
    AuthenticationModel.belongsTo(models.UserModel, {
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

AuthenticationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    mfaEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    mfaSecret: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: null,
    },
    mfaRecoveryCodes: {
      type: DataTypes.ARRAY(DataTypes.STRING(10)),
      allowNull: true,
      defaultValue: [],
    },
    otpSecret: {
      type: DataTypes.STRING(6),
      allowNull: true,
      defaultValue: null,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    lastOtpAttempt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    otpAttemptCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: { msg: 'User ID is required' },
        isUUID: { args: 4, msg: 'User ID must be a valid UUIDv4' },
      },
      references: {
        model: 'Users',
        key: 'id',
      },
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Authentication',
    tableName: 'Authentications',
    timestamps: true,
    indexes: [
      {
        name: 'authentications_userId_unique_idx',
        fields: ['userId'],
        unique: true,
      },
      {
        name: 'authentications_mfa_status_idx',
        fields: ['mfaEnabled'],
        where: { mfaEnabled: true },
      },
      {
        name: 'authentications_otp_attempts_idx',
        fields: ['otpAttemptCount', 'lastOtpAttempt'],
      },
      {
        name: 'authentications_active_otp_idx',
        fields: ['otpSecret', 'otpExpiresAt'],
        where: sequelize.literal('"otpExpiresAt" > NOW()'),
      },
      {
        name: 'authentications_recovery_codes_idx',
        fields: ['mfaRecoveryCodes'],
        using: 'GIN',
      },
    ],
  }
);

type AuthenticationWithUser = AuthenticationModel & {
  [AuthenticationModel.associationNames.user]: UserModel;
};

export { AuthenticationModel, AuthenticationWithUser };
