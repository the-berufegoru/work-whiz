import { plainToInstance } from 'class-transformer';
import { EmployerDto, EmployerResponseDto } from '@work-whiz/dtos';
import { IEmployer } from '@work-whiz/interfaces';

export class EmployerTransformer {
  static toDto(employer: Partial<IEmployer>): EmployerDto {
    return plainToInstance(EmployerDto, employer, {
      excludeExtraneousValues: false,
      enableImplicitConversion: true,
    });
  }

  static toResponseDto(employer: Partial<IEmployer>): EmployerResponseDto {
    return plainToInstance(EmployerResponseDto, employer, {
      excludeExtraneousValues: true,
    });
  }
}
