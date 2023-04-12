import { Injectable } from '@nestjs/common';
import { CityEntity } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly stateRepository: Repository<CityEntity>,
    private readonly cacheService: CacheService,
  ) { }

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[]> {
    return this.cacheService.getCache<CityEntity[]>(`state_${stateId}`,
      () => this.stateRepository.find({
        where: { stateId }
      }),
    );
  }
}
