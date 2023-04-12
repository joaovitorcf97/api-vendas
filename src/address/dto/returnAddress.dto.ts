import { IsInt, IsOptional, IsString } from "class-validator";
import { AddressEntity } from "../entities/address.entity";

export class ReturnAddressDTO {
  complement: string
  numberAddress: number
  cep: string;
  city?: any;

  constructor(address: AddressEntity) {
    this.complement = address.complement;
    this.numberAddress = address.numberAddress;
    this.cep = address.cep;
    this.city = address.cityId;
  }
}