import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { ReturnCepExternalDTO } from './dto/returnCepExternal.dto';
import { CityService } from 'src/city/city.service';

@Injectable()
export class CorreiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) { }

  async findAddressByCep(cep: string): Promise<ReturnCepExternalDTO> {
    const returnCep: ReturnCepExternalDTO = await this.httpService.axiosRef
      .get<ReturnCepExternalDTO>(`http://viacep.com.br/ws/${cep}/json`)
      .then((result) => {
        if (result.data.erro === 'true') {
          throw new NotFoundException(`CEP not found`)
        }
        return result.data
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(`Erro in connection request: ${error.message}`)
      });



    return returnCep;
  }
}
