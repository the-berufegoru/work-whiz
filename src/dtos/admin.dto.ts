import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidateNested,
} from 'class-validator';
import { UserResponseDto } from './user.dto';
import { Permissions, PERMISSIONS } from '@work-whiz/types';

export class AdminDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lastName?: string;

  @Expose()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : []))
  @Validate(
    (value: Permissions[]) =>
      value.every((p) => PERMISSIONS.includes(p)) || {
        message: 'Invalid permission',
      }
  )
  permissions: Permissions[] = [];

  @Expose()
  @Type(() => UserResponseDto)
  @ValidateNested()
  @IsOptional()
  user?: UserResponseDto;

  @Expose()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : new Date(0)))
  createdAt: Date;

  @Expose()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : new Date(0)))
  updatedAt: Date;
}

export class AdminResponseDto extends AdminDto {
  @Expose()
  get fullName() {
    return (
      [this.firstName, this.lastName].filter(Boolean).join(' ') || undefined
    );
  }
}
