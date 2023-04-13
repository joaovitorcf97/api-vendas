import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { ReturnUserDTO } from 'src/user/dto/returnUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(@Body() login: LoginDTO): Promise<ReturnUserDTO> {
    return this.authService.login(login);
  }
}
