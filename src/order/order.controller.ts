import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  @Post('/cart/:cartId')
  @UsePipes(ValidationPipe)
  async createOrder(
    @Param('cartId') cartId: number,
    @Body() createOrderDTO: CreateOrderDTO,
  ) {
    return this.orderService.createOrder(cartId, createOrderDTO);
  }
}
