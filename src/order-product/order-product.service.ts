import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProductEntity } from './entities/orderProduct.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderRepository: Repository<OrderProductEntity>,
  ) { }

  async createOrderProduct(
    productId: number,
    orderId: number,
    price: number,
    amount: number,
  ): Promise<OrderProductEntity> {
    return this.orderRepository.save({
      amount,
      orderId,
      price,
      productId,
    });
  }
}
