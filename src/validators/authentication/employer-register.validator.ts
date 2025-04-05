import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { EmployerRegisterDTO } from '@work-whiz/dtos/authentication/employer-register.dto';

export async function validateEmployerDTO(data: any): Promise<{
  isValid: boolean;
  errors?: string[];
  validatedData?: EmployerRegisterDTO;
}> {
  const candidate = plainToClass(EmployerRegisterDTO, data);
  const errors = await validate(candidate);

  if (errors.length > 0) {
    const errorMessages = errors.flatMap((error) =>
      Object.values(error.constraints || {})
    );
    return { isValid: false, errors: errorMessages };
  }

  return { isValid: true, validatedData: candidate };
}
