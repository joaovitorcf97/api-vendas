import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDTO } from './dto/createAddress.dto';
import { AddressEntity } from './entities/address.entity';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/userType.enem';
import { UserId } from 'src/decorators/userId.decorator';

@Roles(UserType.User)
@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDTO: CreateAddressDTO,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    console.log('userId', userId)
    return this.addressService.createAddress(createAddressDTO, userId);
  }
}
