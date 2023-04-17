import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createUserDTO } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './enum/userType.enem';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { createPasswordHashed, validatePassword } from 'src/utils/password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async createUser(createUserDTO: createUserDTO): Promise<UserEntity> {
    const user = await this.findUserByEmail(createUserDTO.email)
      .catch(() => undefined);

    if (user) {
      throw new BadRequestException(`E-mail já esta sendo usado.`);
    }

    const passwordHashed = await createPasswordHashed(createUserDTO.password);

    return this.userRepository.save({
      ...createUserDTO,
      typeUser: UserType.User,
      password: passwordHashed
    });
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: {
        addresses: {
          city: {
            state: true,
          }
        }
      }
    })
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException(`UserId ${userId} not found`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException(`E-mail ${email} not found`);
    }

    return user;
  }

  async updatePassword(updatePassword: UpdatePasswordDTO, userId: number): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    const passwordHashed = await createPasswordHashed(updatePassword.newPassword);

    const isMatch = await validatePassword(updatePassword.lastPassword, user.password || '');

    if (!isMatch) {
      throw new BadRequestException(`Last password invalid`);
    }

    return this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
  }
}
