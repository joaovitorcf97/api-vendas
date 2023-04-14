import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/userType.enem';

@Roles(UserType.User)
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService
  ) { }
}
