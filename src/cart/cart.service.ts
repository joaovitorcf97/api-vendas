import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDTO } from './dto/insertCart.dto';
import { CartProductService } from 'src/cart-product/cart-product.service';
import { userInfo } from 'os';
import { UserId } from 'src/decorators/userId.decorator';
import { UpdateCartDTO } from './dto/updateCart.dto';

const LINE_AFFECTED = 1;

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService,
  ) { }

  async findCardByUserId(userId: number, isRelations?: boolean) {
    const relations = isRelations ? {
      cartProduct: {
        product: true
      }
    } : undefined;

    const cart = await this.cartRepository.findOne({
      where: {
        userId,
        active: true
      },
      relations,
    });

    if (!cart) {
      throw new NotFoundException(`Cart active not found`);
    }

    return cart;
  }

  async createCart(userId: number): Promise<CartEntity> {
    return this.cartRepository.save({
      active: true,
      userId,
    });
  }

  async insertProductInCart(insertCartDTO: InsertCartDTO, userId: number): Promise<CartEntity> {
    const cart = await this.findCardByUserId(userId)
      .catch(async () => {
        return this.createCart(userId)
      });

    await this.cartProductService.insertProductInCart(insertCartDTO, cart);

    return cart;
  }

  async clearCart(userId: number): Promise<DeleteResult> {
    const cart = await this.findCardByUserId(userId);

    await this.cartRepository.save({
      ...cart,
      active: false,
    });

    return {
      raw: [],
      affected: LINE_AFFECTED,
    }
  }

  async deleteProductCart(productId: number, userId: number): Promise<DeleteResult> {
    const cart = await this.findCardByUserId(userId);
    return this.cartProductService.deleteProductCart(productId, cart.id);
  }

  async updateProductInCart(updateCartaDTO: UpdateCartDTO, userId: number): Promise<CartEntity> {
    const cart = await this.findCardByUserId(userId)
      .catch(async () => {
        return this.createCart(userId)
      });

    await this.cartProductService.updateProductInCart(updateCartaDTO, cart);

    return cart;
  }
}
