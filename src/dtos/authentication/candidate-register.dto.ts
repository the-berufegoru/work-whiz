import { BaseRegisterDTO } from './base-register.dto';
import { IsString, MinLength } from 'class-validator';

export class CandidateRegisterDTO extends BaseRegisterDTO {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @MinLength(3)
  title: string;
}
