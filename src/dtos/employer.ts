import { IEmployer, IUser } from '@work-whiz/interfaces/database';

type SafeUser = Omit<IUser, 'password'>;

const toIEmployerDTO = (
  employer: Partial<IEmployer>
): Omit<IEmployer, 'user'> & {
  user?: SafeUser;
} => ({
  id: employer.id,
  name: employer.name,
  industry: employer.industry,
  website_url: employer.website_url,
  location: employer.location,
  description: employer.description,
  size: employer.size,
  founded_in: employer.founded_in,
  is_verified: employer.is_verified,
  user: employer.user
    ? (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = employer.user;
        return safeUser as SafeUser;
      })()
    : undefined,
  createdAt: employer.createdAt,
  updatedAt: employer.updatedAt,
});

export { toIEmployerDTO };
