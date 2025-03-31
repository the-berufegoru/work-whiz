import { plainToInstance } from 'class-transformer';
import {
  AuthenticationDto,
  AuthenticationResponseDto,
  MfaSetupResponseDto,
  OtpResponseDto,
} from '@work-whiz/dtos';
import { IAuthentication } from '@work-whiz/interfaces';

export class AuthenticationTransformer {
  static toDto(data: Partial<IAuthentication>): AuthenticationDto {
    return plainToInstance(AuthenticationDto, data, {
      excludeExtraneousValues: false,
    });
  }

  static toResponseDto(data: AuthenticationDto): AuthenticationResponseDto {
    return new AuthenticationResponseDto(data);
  }

  static toMfaSetupDto(data: AuthenticationDto): MfaSetupResponseDto {
    return new MfaSetupResponseDto(data);
  }

  static toOtpResponse(
    isValid: boolean,
    remainingAttempts?: number,
    nextAttemptAt?: Date
  ): OtpResponseDto {
    return new OtpResponseDto(isValid, remainingAttempts, nextAttemptAt);
  }
}
