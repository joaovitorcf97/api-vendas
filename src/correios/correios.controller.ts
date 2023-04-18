import { Controller, Get, Param } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CorreiosService } from './correios.service';

@Controller('correios')
export class CorreiosController {
  constructor(
    private readonly correiosService: CorreiosService,
  ) { }

  @Get('/:cep')
  async findAll(@Param('cep') cep: string): Promise<AxiosResponse<any>> {
    return this.correiosService.findAddressByCep(cep);
  }
}
