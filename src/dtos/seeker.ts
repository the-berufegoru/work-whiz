import { ISeeker, IUser } from '@work-whiz/interfaces/database';

type SafeUser = Omit<IUser, 'password'>;

const toISeekerDTO = (
  seeker: Partial<ISeeker>
): Omit<ISeeker, 'user'> & {
  user?: SafeUser;
} => ({
  id: seeker.id ?? '',
  first_name: seeker.first_name ?? undefined,
  last_name: seeker.last_name ?? undefined,
  title: seeker.title ?? undefined,
  skills: seeker.skills ?? [],
  is_employed: seeker.is_employed ?? false,
  user: seeker.user
    ? (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = seeker.user;
        return safeUser as SafeUser;
      })()
    : undefined,
  createdAt: seeker.createdAt ?? new Date(0),
  updatedAt: seeker.updatedAt ?? new Date(0),
});

export { toISeekerDTO };
