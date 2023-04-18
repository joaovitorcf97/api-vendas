import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { ReturnCepExternalDTO } from './dto/returnCepExternal.dto';
import { CityService } from 'src/city/city.service';
import { ReturnCepDTO } from './dto/returnCep.dto';
import { CityEntity } from 'src/city/entities/city.entity';

@Injectable()
export class CorreiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) { }

  async findAddressByCep(cep: string): Promise<ReturnCepDTO> {
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

    const city: CityEntity | undefined = await this.cityService.findCityByName(
      returnCep.localidade,
      returnCep.uf
    ).catch(() => undefined)

    return new ReturnCepDTO(returnCep, city?.id, city?.state?.id);
  }
}
