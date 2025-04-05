import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { EmployerRegisterDTO } from '@work-whiz/dtos/authentication/employer-register.dto';
import { BaseRegisterDTO } from '@work-whiz/dtos/authentication/base-register.dto';

describe('EmployerRegisterDTO', () => {
  it('should extend BaseRegisterDTO', () => {
    const dto = new EmployerRegisterDTO();
    expect(dto).toBeInstanceOf(BaseRegisterDTO);
  });

  // Test validation of all required fields
  describe('Field Validation', () => {
    it('should validate all required fields when empty', async () => {
      const emptyDto = plainToClass(EmployerRegisterDTO, {});
      const errors = await validate(emptyDto);
      
      if (errors.length < 4) {
        console.log('Validation errors:', errors.map(e => ({
          property: e.property,
          constraints: e.constraints
        })));
      }

      expect(errors.some(e => e.property === 'email')).toBeTruthy();
      expect(errors.some(e => e.property === 'phone')).toBeTruthy();
      
      expect(errors.some(e => e.property === 'company')).toBeTruthy();
      expect(errors.some(e => e.property === 'industry')).toBeTruthy();
    });


    // Test industry field constraints
    it('should validate industry field requirements', async () => {
      const testCases = [
        { value: 'X', valid: false }, 
        { value: null, valid: false },
        { value: 'IT', valid: true }, 
        { value: 'Finance & Banking', valid: true } 
      ];

      for (const testCase of testCases) {
        const dto = plainToClass(EmployerRegisterDTO, {
          industry: testCase.value,
          company: 'ValidCompany', 
          email: 'test@example.com',
          phone: '+27821234567'
        });

        const errors = await validate(dto);
        if (testCase.valid) {
          expect(errors.some(e => e.property === 'industry')).toBeFalsy();
        } else {
          const industryError = errors.find(e => e.property === 'industry');
          expect(industryError?.constraints).toHaveProperty(
            testCase.value === null ? 'isString' : 'minLength'
          );
        }
      }
    });

    it('should pass validation with valid data', async () => {
      const validDto = plainToClass(EmployerRegisterDTO, {
        email: 'employer@example.com',
        phone: '+27821234567',
        company: 'Tech Solutions Ltd',
        industry: 'Information Technology'
      });

      const errors = await validate(validDto);
      expect(errors).toHaveLength(0);
    });
  });

 
});