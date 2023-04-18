import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { OrderService } from './order.service';
import { UserId } from 'src/decorators/userId.decorator';
import { OrderEntity } from './entities/order.entity';

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

  @Get()
  async findOrdersByUserId(@UserId() userId: number): Promise<OrderEntity[]> {
    return this.orderService.findOrdersByUserId(userId);
  }
}
