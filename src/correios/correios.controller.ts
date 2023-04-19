import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ReturnCepExternalDTO } from './dto/returnCepExternal.dto';
import { ReturnCepDTO } from './dto/returnCep.dto';
import { ResponsePriceCorreios } from './dto/responsePriceCorreios';

@Controller('correios')
export class CorreiosController {
  constructor(
    private readonly correiosService: CorreiosService,
  ) { }

  @Get('/price')
  async findPriceDelivery(): Promise<ResponsePriceCorreios> {
    return this.correiosService.findPriceDelivery();
  }

  @Get('/:cep')
  async findAll(@Param('cep') cep: string): Promise<ReturnCepDTO> {
    return this.correiosService.findAddressByCep(cep);
  }
}
