import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProductEntity } from './entities/orderProduct.entity';
import { In, Repository } from 'typeorm';
import { ReturnGroupOrderDTO } from './dto/returnGroupOrder.dto';

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

  async findAmountProductsByOrderId(orderId: number[]): Promise<ReturnGroupOrderDTO[]> {
    return this.orderRepository.
      createQueryBuilder('order_product')
      .select('order_product.order_id, COUNT(*) as total')
      .where('order_product.order_id IN (:...ids)', { ids: orderId })
      .groupBy('order_product.order_id')
      .getRawMany();
  }
}
