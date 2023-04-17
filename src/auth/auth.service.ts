import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDTO } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ReturnLoginDTO } from './dto/returnLogin.dto';
import { ReturnUserDTO } from '../user/dto/returnUser.dto';
import { LoginPayload } from './dto/loginPayload.dto';
import { validatePassword } from 'src/utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) { }

  async login(login: LoginDTO): Promise<ReturnLoginDTO> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(login.email)
      .catch(() => undefined);

    const isMatch = await validatePassword(login.password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException('E-mail or password envalid');
    }

    return {
      acessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
      user: new ReturnUserDTO(user)
    };
  }
}
