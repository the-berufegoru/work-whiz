import { IsPhoneNumber, ValidationArguments } from 'class-validator';

/**
 * Validates phone numbers with country-specific rules
 * @param countryCode - ISO 2-letter country code (e.g., 'US', 'ZA')
 * @param options - Custom validation options
 */
export const IsValidPhoneNumber = (
  countryCode = 'ZA',
  options?: { message?: string; required?: boolean }
) =>
  IsPhoneNumber(countryCode as any, {
    message: (args: ValidationArguments) =>
      options?.message ||
      `${args.property} must be a valid ${countryCode} phone number`,
  });

/**
 * Standalone phone validator function
 * @param phone - The phone number to validate
 * @param countryCode - ISO 2-letter country code
 */
export const validatePhoneNumber = (
  phone: string,
  countryCode = 'ZA'
): boolean => getCountryPattern(countryCode).test(phone);

// Country-specific regex patterns
const getCountryPattern = (countryCode: string): RegExp => {
  const patterns: Record<string, RegExp> = {
    ZA: /^(\+27|0)[6-8][0-9]{8}$/, // South Africa
    US: /^(\+1|)[2-9][0-9]{2}[2-9][0-9]{6}$/, // United States
    UK: /^(\+44|0)7[0-9]{9}$/, // United Kingdom
    DEFAULT: /^\+?[1-9][0-9]{7,14}$/, // International fallback
  };

  return patterns[countryCode] || patterns.DEFAULT;
};
