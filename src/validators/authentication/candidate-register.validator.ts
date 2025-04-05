import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CandidateRegisterDTO } from '@work-whiz/dtos/authentication/candidate-register.dto';

export async function validateCandidateDTO(data: any): Promise<{
  isValid: boolean;
  errors?: string[];
  validatedData?: CandidateRegisterDTO;
}> {
  const candidate = plainToClass(CandidateRegisterDTO, data);
  const errors = await validate(candidate);

  if (errors.length > 0) {
    const errorMessages = errors.flatMap((error) =>
      Object.values(error.constraints || {})
    );
    return { isValid: false, errors: errorMessages };
  }

  return { isValid: true, validatedData: candidate };
}
