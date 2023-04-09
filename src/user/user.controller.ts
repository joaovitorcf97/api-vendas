import { Body, Controller, Get, Post } from '@nestjs/common';
import { createUserDTO } from './dto/createUser.dto';

@Controller('user')
export class UserController {
  @Post()
  async createUser(@Body() createUser: createUserDTO) {
    return {
      ...createUser,
      password: undefined
    };
  }
}
