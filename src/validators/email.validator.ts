import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
  IsEmail,
} from 'class-validator';

const BLOCKED_DOMAINS = ['protonmail.com', 'pront.me', 'tutanota.io'];
const INVALID_TLDS = ['invalidtld', 'localhost', 'test', 'example'];

@ValidatorConstraint({ name: 'isAllowedEmail', async: false })
export class IsAllowedEmailConstraint implements ValidatorConstraintInterface {
  validate(email: string): boolean {
    if (!email) return false;

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    // Check blocked domains
    if (
      BLOCKED_DOMAINS.some(
        (blocked) => domain === blocked || domain.endsWith(`.${blocked}`)
      )
    ) {
      return false;
    }

    // Check invalid TLDs
    const tld = domain.split('.').pop();
    if (tld && INVALID_TLDS.includes(tld)) return false;

    return true;
  }

  defaultMessage({ value }: ValidationArguments): string {
    if (!value) return 'Email is required';

    const domain = value.split('@')[1]?.toLowerCase();
    if (!domain) return 'Invalid email format';

    if (BLOCKED_DOMAINS.some((b) => domain === b || domain.endsWith(`.${b}`))) {
      return 'We do not accept emails from this provider';
    }

    return 'Please enter a valid email address';
  }
}

// Decorator function
export function IsAllowedEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    // First apply standard email validation
    IsEmail({}, validationOptions)(object, propertyName);

    // Then apply custom validation
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAllowedEmailConstraint,
    });
  };
}
