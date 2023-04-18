import { ReturnCepExternalDTO } from "./returnCepExternal.dto";

export class ReturnCepDTO {
  cep: string;
  publicPlace: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  ddd: string;
  cityId?: number;
  stateId?: number;

  constructor(cep: ReturnCepExternalDTO, cityId?: number, stateId?: number) {
    this.cep = cep.cep;
    this.publicPlace = cep.logradouro;
    this.complement = cep.complemente;
    this.neighborhood = cep.bairro;
    this.city = cep.localidade;
    this.uf = cep.uf;
    this.ddd = cep.ddd;
    this.cityId = cityId;
    this.stateId = stateId;
  }
}