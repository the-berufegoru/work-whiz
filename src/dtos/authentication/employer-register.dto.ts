import { BaseRegisterDTO } from './base-register.dto';
import { IsString, MinLength } from 'class-validator';

export class EmployerRegisterDTO extends BaseRegisterDTO {
  @IsString()
  @MinLength(2)
  company: string;

  @IsString()
  @MinLength(2)
  industry: string;
}
