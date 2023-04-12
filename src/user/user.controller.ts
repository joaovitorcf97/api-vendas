import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { createUserDTO } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './interfaces/user.entity';
import { ReturnUserDTO } from './dto/returnUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() createUser: createUserDTO): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  }

  @Get()
  async getAllUser(): Promise<ReturnUserDTO[]> {
    return (await this.userService.getAllUser()).map(
      (userEntity) => new ReturnUserDTO(userEntity)
    );
  }
}
