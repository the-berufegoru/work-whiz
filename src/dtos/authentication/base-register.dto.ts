import { IsAllowedEmail, IsValidPhoneNumber } from '@work-whiz/validators';

export class BaseRegisterDTO {
  @IsAllowedEmail()
  email: string;

  @IsValidPhoneNumber('ZA')
  phone: string;
}
