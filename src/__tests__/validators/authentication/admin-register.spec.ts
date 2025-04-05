import { validateAdminDTO } from '@work-whiz/validators/authentication/admin-register.validator';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

jest.mock('class-validator', () => {
  const originalModule = jest.requireActual('class-validator');

  return {
    ...originalModule,
    validate: jest.fn(),
    IsEmail: jest.fn().mockImplementation(() => {
      return function (target: any, propertyKey: string) {
        originalModule.registerDecorator({
          name: 'isEmail',
          target: target.constructor,
          propertyName: propertyKey,
          options: {},
          validator: {
            validate(value: string) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            defaultMessage() {
              return 'Invalid email format';
            },
          },
        });
      };
    }),
  };
});

// Mock class-transformer
jest.mock('class-transformer', () => ({
  plainToClass: jest.fn(),
}));

describe('validateAdminDTO', () => {
  const mockValidate = validate as jest.MockedFunction<typeof validate>;
  const mockPlainToClass = plainToClass as jest.MockedFunction<
    typeof plainToClass
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return isValid true for valid data', async () => {
    const validData = {
      email: 'test@example.com',
      phone: '+27821234567',
      firstName: 'John',
      lastName: 'Doe',
    };

    mockPlainToClass.mockReturnValue(validData as any);
    mockValidate.mockResolvedValue([]);

    const result = await validateAdminDTO(validData);

    expect(result).toEqual({
      isValid: true,
      validatedData: validData,
    });
  });

  it('should return isValid false with errors for invalid data', async () => {
    const invalidData = {
      email: 'invalid-email',
      phone: '123',
      firstName: 'J',
      lastName: '',
    };

    const mockErrors = [
      {
        property: 'email',
        constraints: {
          isEmail: 'Invalid email format',
          isAllowedEmail: 'Invalid email format',
        },
      },
      {
        property: 'phone',
        constraints: {
          isValidPhoneNumber: 'phone must be a valid ZA phone number',
        },
      },
      {
        property: 'firstName',
        constraints: {
          minLength: 'firstName must be longer than or equal to 2 characters',
        },
      },
      {
        property: 'lastName',
        constraints: {
          isString: 'lastName must be a string',
          minLength: 'lastName must be longer than or equal to 2 characters',
        },
      },
    ];

    mockPlainToClass.mockReturnValue(invalidData as any);
    mockValidate.mockResolvedValue(mockErrors as any);

    const result = await validateAdminDTO(invalidData);

    expect(result).toEqual({
      isValid: false,
      errors: [
        'Invalid email format',
        'Invalid email format',
        'phone must be a valid ZA phone number',
        'firstName must be longer than or equal to 2 characters',
        'lastName must be a string',
        'lastName must be longer than or equal to 2 characters',
      ],
    });
  });

  // Add more test cases as needed
});
