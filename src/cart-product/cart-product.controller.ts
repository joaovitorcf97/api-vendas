import { Controller } from '@nestjs/common';
import { CartProductService } from './cart-product.service';

@Controller('cart-product')
export class CartProductController {
  constructor(
    private readonly cardProductService: CartProductService,
  ) { }


}
