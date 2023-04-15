import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enem';
import { CartEntity } from './entities/cart.entity';
import { InsertCartDTO } from './dto/insertCart.dto';
import { UserId } from 'src/decorators/userId.decorator';

@Roles(UserType.User, UserType.Admin)
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService
  ) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createCart(@Body() insertCart: InsertCartDTO, @UserId() userId: number): Promise<CartEntity> {
    return this.cartService.insertProductInCart(insertCart, userId);
  }
}
