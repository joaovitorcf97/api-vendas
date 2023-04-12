import { CacheModule as CacheModuleNest, Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    CacheModuleNest.register({
      ttl: 900000000,
    }),
    CacheModule,
    TypeOrmModule.forFeature([CityEntity])
  ],
  providers: [CityService],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule { }
