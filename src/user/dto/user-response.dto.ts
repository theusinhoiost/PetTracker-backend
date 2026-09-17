import { User } from '../entities/user.entity';

export class UserResponseDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatar: string | null;
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar ?? null;
  }
}
