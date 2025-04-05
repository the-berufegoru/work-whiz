import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AdminRegisterDTO } from '@work-whiz/dtos/authentication/admin-register.dto';

export async function validateAdminDTO(data: any): Promise<{
  isValid: boolean;
  errors?: string[];
  validatedData?: AdminRegisterDTO;
}> {
  const admin = plainToClass(AdminRegisterDTO, data);
  const errors = await validate(admin);

  if (errors.length > 0) {
    const errorMessages = errors.flatMap((error) =>
      Object.values(error.constraints || {})
    );
    return { isValid: false, errors: errorMessages };
  }

  return { isValid: true, validatedData: admin };
}
