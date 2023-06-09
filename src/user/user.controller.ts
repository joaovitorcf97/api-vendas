import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { createUserDTO } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ReturnUserDTO } from './dto/returnUser.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { UserId } from 'src/decorators/userId.decorator';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from './enum/userType.enem';

@Roles(UserType.Root)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(UserType.Root)
  @Post('/admin')
  async createAdmin(@Body() createUser: createUserDTO): Promise<UserEntity> {
    return this.userService.createUser(createUser, UserType.Admin);
  }

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() createUser: createUserDTO): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  }

  @Get('all')
  @Roles(UserType.Root, UserType.Admin)
  async getAllUser(): Promise<ReturnUserDTO[]> {
    return (await this.userService.getAllUser()).map(
      (userEntity) => new ReturnUserDTO(userEntity)
    );
  }

  @Get('/:userId')
  @Roles(UserType.Root, UserType.Admin)
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDTO> {
    return new ReturnUserDTO(await this.userService.getUserByIdUsingRelations(userId));
  }

  @Patch('/:userId')
  @Roles(UserType.Root, UserType.Admin, UserType.User)
  @UsePipes(ValidationPipe)
  async updatePassword(@UserId() userId: number, @Body() updatePassword: UpdatePasswordDTO): Promise<UserEntity> {
    return this.userService.updatePassword(updatePassword, userId);
  }

  @Get()
  @Roles(UserType.Root, UserType.Admin, UserType.User)
  async getInfoUser(@UserId() userId: number): Promise<ReturnUserDTO> {
    return new ReturnUserDTO(await this.userService.getUserByIdUsingRelations(userId));
  }
}
