import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { UserResponseDto } from './user.dto';

export class CandidateDto {
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
  @IsOptional()
  @IsString()
  title?: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value || [])
  skills: string[] = [];

  @Expose()
  @IsBoolean()
  @Transform(({ value }) => value ?? false)
  isEmployed: boolean;

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

// For responses (extends base DTO)
export class CandidateResponseDto extends CandidateDto {
  @Expose()
  get fullName() {
    return (
      [this.firstName, this.lastName].filter(Boolean).join(' ') || undefined
    );
  }
}
