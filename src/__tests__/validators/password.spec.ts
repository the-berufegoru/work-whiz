import { validate } from 'class-validator';
import { PasswordDto } from '@work-whiz/validators/password.validator';

describe('StrongPasswordConstraint', () => {
  it('should pass for a strong password', async () => {
    const dto = new PasswordDto();
    dto.password = 'Str0ngP@ssw0rd!';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail if password is empty', async () => {
    const dto = new PasswordDto();
    dto.password = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isNotEmpty).toBe('Please enter a password');
  });

  it('should fail if password is too short', async () => {
    const dto = new PasswordDto();
    dto.password = 'Short1!';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.minLength).toBe(
      'Password should be at least 12 characters long'
    );
  });

  it('should fail if password does not contain required character types', async () => {
    const dto = new PasswordDto();
    dto.password = 'onlylowercaseletters';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isStrongPassword).toBe(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  });

  it('should fail if password exceeds max length', async () => {
    const dto = new PasswordDto();
    dto.password = 'A'.repeat(65);

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.maxLength).toBe(
      'Password should not exceed 64 characters'
    );
  });
});
