import { Module } from '@nestjs/common';
import { CartProductService } from './cart-product.service';
import { CartProductController } from './cart-product.controller';

@Module({
  providers: [CartProductService],
  controllers: [CartProductController]
})
export class CartProductModule {}
