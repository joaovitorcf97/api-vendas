import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/user/interfaces/user.entity';
import { LoginDTO } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) { }

  async login(login: LoginDTO): Promise<UserEntity> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(login.email)
      .catch(() => undefined);

    const isMatch = await compare(login.password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException('E-mail or password envalid');
    }

    return user;
  }
}
