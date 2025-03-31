import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class AuthenticationDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsBoolean()
  mfaEnabled: boolean;

  @Expose()
  @IsString()
  mfaSecret?: string | null;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  mfaRecoveryCodes: string[] = [];

  @Expose()
  @IsString()
  otpSecret?: string | null;

  @Expose()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  otpExpiresAt?: Date | null;

  @Expose()
  @IsNumber()
  otpAttemptCount = 0;

  @Expose()
  @IsUUID()
  userId: string;
}

export class AuthenticationResponseDto {
  @Expose()
  id: string;

  @Expose()
  mfaEnabled: boolean;

  @Expose()
  get mfaStatus() {
    return this.mfaEnabled ? 'ENABLED' : 'DISABLED';
  }

  @Expose()
  otpAttemptCount: number;

  @Expose()
  userId: string;

  constructor(partial: Partial<AuthenticationDto>) {
    Object.assign(this, partial);
  }
}

export class MfaSetupResponseDto {
  @Expose()
  mfaEnabled: boolean;

  @Expose()
  mfaSecret?: string | null;

  @Expose()
  recoveryCodes: string[];

  constructor(partial: Partial<AuthenticationDto>) {
    Object.assign(this, {
      mfaEnabled: partial.mfaEnabled,
      mfaSecret: partial.mfaSecret,
      recoveryCodes: partial.mfaRecoveryCodes || [],
    });
  }
}

export class OtpResponseDto {
  @Expose()
  isValid: boolean;

  @Expose()
  remainingAttempts?: number;

  @Expose()
  @Transform(({ value }) => value || null)
  nextAttemptAt?: Date | null;

  constructor(
    isValid: boolean,
    remainingAttempts?: number,
    nextAttemptAt?: Date
  ) {
    this.isValid = isValid;
    this.remainingAttempts = remainingAttempts;
    this.nextAttemptAt = nextAttemptAt;
  }
}
