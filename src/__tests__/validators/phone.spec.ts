import { validateSync } from 'class-validator';
import { validatePhoneNumber, IsValidPhoneNumber } from '@work-whiz/validators/phone.validator';


describe('Phone Validation', () => {
  describe('validatePhoneNumber (standalone)', () => {
    // South Africa
    it('validates ZA numbers correctly', () => {
      expect(validatePhoneNumber('+27821234567', 'ZA')).toBe(true);
      expect(validatePhoneNumber('0821234567', 'ZA')).toBe(true);
      expect(validatePhoneNumber('+44821234567', 'ZA')).toBe(false);
    });

    // United States
    it('validates US numbers correctly', () => {
      expect(validatePhoneNumber('+12025551234', 'US')).toBe(true);
      expect(validatePhoneNumber('2025551234', 'US')).toBe(true);
      expect(validatePhoneNumber('0821234567', 'US')).toBe(false);
    });

    // Edge cases
    it('handles invalid inputs', () => {
      expect(validatePhoneNumber('', 'ZA')).toBe(false);
      expect(validatePhoneNumber('not-a-phone', 'ZA')).toBe(false);
      expect(validatePhoneNumber('+27821234567890123', 'ZA')).toBe(false);
    });
  });

  describe('IsValidPhoneNumber (decorator)', () => {
    class TestDTO {
      @IsValidPhoneNumber('ZA')
      phone: string;
    }

    it('validates through class-validator', () => {
      const validDto = new TestDTO();
      validDto.phone = '+27821234567';

      const invalidDto = new TestDTO();
      invalidDto.phone = '12345';

      expect(validateSync(validDto)).toEqual([]);
      expect(validateSync(invalidDto)).toHaveLength(1);
    });
  });

  describe('Country Patterns', () => {
    const testCases = [
      {
        country: 'ZA',
        valid: ['+27821234567', '0821234567'],
        invalid: ['+44821234567', '082123'],
      },
      {
        country: 'US',
        valid: ['+12025551234', '2025551234'],
        invalid: ['+27821234567', '123'],
      },
      { country: 'XX', valid: ['+1234567890'], invalid: ['short'] },
    ];

    testCases.forEach(({ country, valid, invalid }) => {
      it(`handles ${country} patterns`, () => {
        valid.forEach((num) =>
          expect(validatePhoneNumber(num, country)).toBe(true)
        );
        invalid.forEach((num) =>
          expect(validatePhoneNumber(num, country)).toBe(false)
        );
      });
    });
  });
});
