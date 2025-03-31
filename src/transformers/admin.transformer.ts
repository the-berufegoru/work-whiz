import { plainToInstance } from 'class-transformer';
import { AdminDto, AdminResponseDto } from '@work-whiz/dtos';
import { IAdmin } from '@work-whiz/interfaces';

export class AdminTransformer {
  static toDto(data: Partial<IAdmin>): AdminDto {
    return plainToInstance(AdminDto, data, {
      excludeExtraneousValues: false,
      enableImplicitConversion: true,
    });
  }

  static toResponseDto(data: Partial<IAdmin>): AdminResponseDto {
    return plainToInstance(AdminResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
