import { plainToInstance } from 'class-transformer';
import { UserDto, UserResponseDto } from '@work-whiz/dtos';
import { IUser } from '@work-whiz/interfaces';

export class UserTransformer {
  static toDto(user: IUser): UserDto {
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  static toResponseDto(user: IUser): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
