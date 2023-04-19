import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enem';
import { CartEntity } from './entities/cart.entity';
import { InsertCartDTO } from './dto/insertCart.dto';
import { UserId } from 'src/decorators/userId.decorator';
import { ReturnCartDTO } from './dto/returnCart.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCartDTO } from './dto/updateCart.dto';

@Roles(UserType.User, UserType.Root, UserType.Admin)
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService
  ) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createCart(
    @Body() insertCart: InsertCartDTO,
    @UserId() userId: number
  ): Promise<ReturnCartDTO> {
    return new ReturnCartDTO(await this.cartService.insertProductInCart(insertCart, userId));
  }

  @Get()
  async findCartByUserId(@UserId() UserId: number): Promise<ReturnCartDTO> {
    return new ReturnCartDTO(await this.cartService.findCardByUserId(UserId, true));
  }

  @Delete()
  async clearCart(@UserId() UserId: number): Promise<DeleteResult> {
    return this.cartService.clearCart(UserId);
  }

  @Delete('/product/:productId')
  async deleteProductCart(
    @Param('productId') productId: number,
    @UserId() userId: number
  ): Promise<DeleteResult> {
    return this.cartService.deleteProductCart(productId, userId);
  }

  @Patch()
  @UsePipes(ValidationPipe)
  async updateProductInCart(
    @Body() updateCartDTO: UpdateCartDTO,
    @UserId() userId: number
  ): Promise<ReturnCartDTO> {
    return new ReturnCartDTO(
      await this.cartService.updateProductInCart(updateCartDTO, userId)
    );
  }
}
