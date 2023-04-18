import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { CartService } from 'src/cart/cart.service';
import { OrderProductService } from 'src/order-product/order-product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
  ) { }

  async createOrder(
    cartId: number,
    createOrder: CreateOrderDTO,
    userId: number,
  ) {
    const payment: PaymentEntity = await this.paymentService.createPayment(createOrder);
    const order = await this.orderRepository.save({
      addressId: createOrder.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });

    const cart = await this.cartService.findCardByUserId(userId, true);

    cart.cartProduct?.forEach((cartProduct) => {
      this.orderProductService.createOrderProduct(
        cartProduct.productId,
        order.id,
        0,
        cartProduct.amount,
      )
    });

    return null;
  }
}
