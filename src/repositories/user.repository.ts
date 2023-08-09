import { User } from '../entities/user';

interface UserRepository {
  add(user: User): Promise<User>;

  existsByEmail(email: string): Promise<User | undefined>;
}

export { UserRepository };
