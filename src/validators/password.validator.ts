import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class StrongPasswordConstraint implements ValidatorConstraintInterface {
  validate = (password: string): boolean =>
    !!password &&
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]+$/.test(
      password
    );

  defaultMessage = (): string =>
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
}

export const IsStrongPassword =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: StrongPasswordConstraint,
    });
  };

export class PasswordDto {
  @IsNotEmpty({ message: 'Please enter a password' })
  @MinLength(12, { message: 'Password should be at least 12 characters long' })
  @MaxLength(64, { message: 'Password should not exceed 64 characters' })
  @IsStrongPassword()
  password: string;
}
