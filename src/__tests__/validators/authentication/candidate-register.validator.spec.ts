import { validateCandidateDTO } from '@work-whiz/validators/authentication/candidate-register.validator';
import { CandidateRegisterDTO } from '@work-whiz/dtos/authentication/candidate-register.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

jest.mock('class-validator', () => {
  const original = jest.requireActual('class-validator');
  return {
    ...original,
    validate: jest.fn(),
  };
});

jest.mock('class-transformer', () => ({
  plainToClass: jest.fn(),
}));

describe('validateCandidateDTO', () => {
  const mockValidate = validate as jest.MockedFunction<typeof validate>;
  const mockPlainToClass = plainToClass as jest.MockedFunction<
    typeof plainToClass
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate successfully with all required fields', async () => {
    const validData = {
      email: 'candidate@example.com',
      phone: '+27821234567',
      firstName: 'John',
      lastName: 'Doe',
      title: 'Software Engineer',
    };

    mockPlainToClass.mockReturnValue(validData as any);
    mockValidate.mockResolvedValue([]);

    const result = await validateCandidateDTO(validData);

    expect(result).toEqual({
      isValid: true,
      validatedData: validData,
    });
    expect(mockPlainToClass).toHaveBeenCalledWith(
      CandidateRegisterDTO,
      validData
    );
  });

  it('should fail validation with missing required fields', async () => {
    const invalidData = {
      email: 'invalid-email',
      phone: '123',
      firstName: 'J',
      lastName: '',
      // Missing title
    };

    const mockErrors = [
      {
        property: 'email',
        constraints: { isAllowedEmail: 'Invalid email format' },
      },
      {
        property: 'phone',
        constraints: { isValidPhoneNumber: 'Invalid phone number' },
      },
      {
        property: 'firstName',
        constraints: { minLength: 'Must be at least 2 characters' },
      },
      {
        property: 'lastName',
        constraints: {
          isString: 'Must be a string',
          minLength: 'Must be at least 2 characters',
        },
      },
      {
        property: 'title',
        constraints: {
          isString: 'Must be a string',
          minLength: 'Must be at least 3 characters',
        },
      },
    ];

    mockPlainToClass.mockReturnValue(invalidData as any);
    mockValidate.mockResolvedValue(mockErrors as any);

    const result = await validateCandidateDTO(invalidData);

    expect(result).toEqual({
      isValid: false,
      errors: [
        'Invalid email format',
        'Invalid phone number',
        'Must be at least 2 characters',
        'Must be a string',
        'Must be at least 2 characters',
        'Must be a string',
        'Must be at least 3 characters',
      ],
    });
  });

  it('should validate title field requirements', async () => {
    const testCases = [
      { title: 'Dev', valid: true },
      { title: 'A', valid: false },
      { title: '', valid: false },
      { title: '   ', valid: false },
      { title: 'Senior Developer', valid: true },
    ];

    for (const testCase of testCases) {
      const testData = {
        email: 'test@example.com',
        phone: '+27821234567',
        firstName: 'John',
        lastName: 'Doe',
        title: testCase.title,
      };

      if (testCase.valid) {
        mockValidate.mockResolvedValueOnce([]);
      } else {
        mockValidate.mockResolvedValueOnce([
          {
            property: 'title',
            constraints: { minLength: 'Must be at least 3 characters' },
          },
        ]);
      }

      mockPlainToClass.mockReturnValue(testData as any);
      const result = await validateCandidateDTO(testData);

      expect(result.isValid).toBe(testCase.valid);
      if (!testCase.valid) {
        expect(result.errors).toContain('Must be at least 3 characters');
      }
    }
  });

  it('should handle empty input object', async () => {
    const emptyData = {};

    const mockErrors = [
      {
        property: 'email',
        constraints: { isAllowedEmail: 'Email is required' },
      },
      {
        property: 'phone',
        constraints: { isValidPhoneNumber: 'Phone is required' },
      },
      {
        property: 'firstName',
        constraints: {
          isString: 'Must be a string',
          minLength: 'Must be at least 2 characters',
        },
      },
      {
        property: 'lastName',
        constraints: {
          isString: 'Must be a string',
          minLength: 'Must be at least 2 characters',
        },
      },
      {
        property: 'title',
        constraints: {
          isString: 'Must be a string',
          minLength: 'Must be at least 3 characters',
        },
      },
    ];

    mockPlainToClass.mockReturnValue(emptyData as any);
    mockValidate.mockResolvedValue(mockErrors as any);

    const result = await validateCandidateDTO(emptyData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(8); 
  });

  it('should handle validation errors from BaseRegisterDTO', async () => {
    const invalidBaseData = {
      email: 'invalid@protonmail.com', 
      phone: 'invalid',
      firstName: 'Valid',
      lastName: 'Name',
      title: 'Valid Title',
    };

    const mockErrors = [
      {
        property: 'email',
        constraints: { isAllowedEmail: 'Blocked email provider' },
      },
      {
        property: 'phone',
        constraints: { isValidPhoneNumber: 'Invalid phone format' },
      },
    ];

    mockPlainToClass.mockReturnValue(invalidBaseData as any);
    mockValidate.mockResolvedValue(mockErrors as any);

    const result = await validateCandidateDTO(invalidBaseData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual([
      'Blocked email provider',
      'Invalid phone format',
    ]);
  });
});
