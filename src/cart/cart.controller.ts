import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enem';

@Roles(UserType.User)
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService
  ) { }
}
