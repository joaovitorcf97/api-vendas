import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorators/userId.decorator';
import { OrderEntity } from './entities/order.entity';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/userType.enem';
import { ReturnOrderDTO } from './dto/returnOrder.dto';

@Roles(UserType.User, UserType.Root, UserType.Admin)
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

  @Roles(UserType.Root, UserType.Admin)
  @Get('/all')
  async findAllOrders(): Promise<ReturnOrderDTO[]> {
    return (await this.orderService.findAllOrders()).map((order) => new ReturnOrderDTO(order));
  }

  @Roles(UserType.Root, UserType.Admin)
  @Get('/:orderId')
  async findOrderById(@Param('orderId') orderId: number): Promise<ReturnOrderDTO> {
    return new ReturnOrderDTO(
      (await this.orderService.findOrdersByUserId(undefined, orderId))[0]
    );
  }
}
