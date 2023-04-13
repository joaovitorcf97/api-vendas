import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ReturnLoginDTO } from './dto/returnLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(@Body() login: LoginDTO): Promise<ReturnLoginDTO> {
    return this.authService.login(login);
  }
}
