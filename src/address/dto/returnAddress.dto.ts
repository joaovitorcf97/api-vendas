import { IsInt, IsOptional, IsString } from "class-validator";
import { AddressEntity } from "../entities/address.entity";
import { ReturnCityDTO } from "../../city/dto/returnCity.dto";

export class ReturnAddressDTO {
  id: number;
  complement: string
  numberAddress: number
  cep: string;
  city?: ReturnCityDTO;

  constructor(address: AddressEntity) {
    this.id = address.id;
    this.complement = address.complement;
    this.numberAddress = address.numberAddress;
    this.cep = address.cep;
    this.city = address.city ? new ReturnCityDTO(address.city) : undefined;
  }
}