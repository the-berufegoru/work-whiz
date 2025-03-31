export interface IAuthentication {
  readonly id: string;
  mfaEnabled: boolean;
  mfaSecret?: string | null;
  mfaRecoveryCodes?: string[];
  otpSecret?: string | null;
  otpExpiresAt?: Date | null;
  lastOtpAttempt?: Date | null;
  otpAttemptCount: number;
  readonly userId: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
