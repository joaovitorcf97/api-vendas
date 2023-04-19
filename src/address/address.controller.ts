import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDTO } from './dto/createAddress.dto';
import { AddressEntity } from './entities/address.entity';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enem';
import { UserId } from '../decorators/userId.decorator';
import { ReturnAddressDTO } from './dto/returnAddress.dto';

@Roles(UserType.User, UserType.Root, UserType.Admin)
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

  @Get()
  async findAddressByUserId(@UserId() userId: number): Promise<ReturnAddressDTO[]> {
    console.log('userId', userId)
    return (await this.addressService.findAddressByUserId(userId)).map(
      (address) => new ReturnAddressDTO(address)
    );
  }
}
