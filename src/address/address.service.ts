import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDTO } from './dto/createAddress.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>
  ) { }

  async createAddress(createAddressDTO: CreateAddressDTO, userId: number): Promise<AddressEntity> {
    return this.addressRepository.save({
      ...createAddressDTO,
      userId,
    });
  }
}
