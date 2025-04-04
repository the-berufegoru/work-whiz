import { validate } from 'class-validator';
import { IsAllowedEmail } from '@work-whiz/validators/email.validator';

class TestDto {
  @IsAllowedEmail()
  email: string;
}

describe('EmailValidator', () => {
  it('should reject blocked domains', async () => {
    const dto = new TestDto();
    dto.email = 'test@protonmail.com';
    const errors = await validate(dto);
    expect(errors[0].constraints.isAllowedEmail).toContain(
      'We do not accept emails from this provider'
    );
  });

  it('should reject invalid TLDs', async () => {
    const dto = new TestDto();
    dto.email = 'test@example.invalidtld';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should accept valid emails', async () => {
    const dto = new TestDto();
    dto.email = 'valid@gmail.com';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject empty emails', async () => {
    const dto = new TestDto();
    dto.email = '';
    const errors = await validate(dto);
    expect(errors[0].constraints.isEmail).toContain('email must be an email');
  });
});