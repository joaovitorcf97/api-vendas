import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { createUserDTO } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './interfaces/user.entity';
import { ReturnUserDTO } from './dto/returnUser.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { UserId } from 'src/decorators/userId.decorator';

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

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDTO> {
    return new ReturnUserDTO(await this.userService.getUserByIdUsingRelations(userId));
  }

  @Patch('/:userId')
  @UsePipes(ValidationPipe)
  async updatePassword(@UserId() userId: number, @Body() updatePassword: UpdatePasswordDTO): Promise<UserEntity> {
    return this.userService.updatePassword(updatePassword, userId);
  }
}
