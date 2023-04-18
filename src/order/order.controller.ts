import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { OrderService } from './order.service';
import { UserId } from 'src/decorators/userId.decorator';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() createOrderDTO: CreateOrderDTO,
    @UserId() userId: number
  ) {
    return this.orderService.createOrder(createOrderDTO, userId);
  }
}
