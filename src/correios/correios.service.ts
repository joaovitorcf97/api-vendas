import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { ReturnCepExternalDTO } from './dto/returnCepExternal.dto';
import { CityService } from 'src/city/city.service';
import { ReturnCepDTO } from './dto/returnCep.dto';
import { CityEntity } from 'src/city/entities/city.entity';
import { Client } from 'nestjs-soap';
import { ResponsePriceCorreios } from './dto/responsePriceCorreios';
import { CDFormatEnum } from './enums/cdFormat.enum';
import { SizeProductDTO } from './dto/sizeProduct.dto';

@Injectable()
export class CorreiosService {
  constructor(
    @Inject('SOAP_CORREIOS')
    private readonly soapClient: Client,
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

  async findPriceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDTO
  ): Promise<ResponsePriceCorreios> {
    return new Promise((resolve) => {
      this.soapClient.CalcPrecoPrazo({
        nCdServico: cdService,
        sCepOrigem: '01029010',
        sCepDestino: cep,
        nVlPeso: sizeProduct.weight,
        nCdFormato: CDFormatEnum.BOX,
        nVlComprimento: sizeProduct.length,
        nVlAltura: sizeProduct.height,
        nVlLargura: sizeProduct.width,
        nVlDiametro: sizeProduct.diameter,
        nCdEmpresa: '',
        sDsSenha: '',
        sCdMaoPropria: 'N',
        nVlValorDeclarado: sizeProduct.productValue < 25 ? 0 : sizeProduct.productValue,
        sCdAvisoRecebimento: 'N',
      }, (_, res: ResponsePriceCorreios) => {
        if (res) {
          resolve(res);
        } else {
          throw new BadRequestException('Error SOAP');
        }
      });
    });
  }
}
