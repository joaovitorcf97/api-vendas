import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartProductEntity } from './entities/cartProduct.entity';
import { InsertCartDTO } from 'src/cart/dto/insertCart.dto';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService,
  ) { }

  async verifyProducInCart(productId: number, cartId: number): Promise<CartProductEntity> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: { productId, cartId }
    });

    if (!cartProduct) {
      throw new NotFoundException(`Product not found in cart`)
    }

    return cartProduct;
  }

  async createProductInCart(insertCartDTO: InsertCartDTO, cartId: number): Promise<CartProductEntity> {
    return this.cartProductRepository.save({
      amount: insertCartDTO.amount,
      productId: insertCartDTO.productId,
      cartId,
    })
  }

  async insertProductInCart(insertCartDTO: InsertCartDTO, cart: CartEntity): Promise<CartProductEntity> {
    await this.productService.findProductById(insertCartDTO.productId);

    const cartProduct = await this.verifyProducInCart(insertCartDTO.productId, cart.id)
      .catch(() => undefined);

    if (!cartProduct) {
      return this.createProductInCart(insertCartDTO, cart.id)
    }

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: cartProduct.amount + insertCartDTO.amount,
    });
  }
}
