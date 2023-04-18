import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { CartService } from 'src/cart/cart.service';
import { OrderProductService } from 'src/order-product/order-product.service';
import { ProductService } from 'src/product/product.service';
import { OrderProductEntity } from 'src/order-product/entities/orderProduct.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService,
  ) { }

  async saveOrder(
    createOrder: CreateOrderDTO,
    userId: number,
    payment: PaymentEntity,
  ): Promise<OrderEntity> {
    return this.orderRepository.save({
      addressId: createOrder.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });
  }

  async createOrderProductUsingCart(cart: CartEntity, orderId: number, products: ProductEntity[]): Promise<OrderProductEntity[]> {
    return Promise.all(
      cart.cartProduct?.map((cartProduct) =>
        this.orderProductService.createOrderProduct(
          cartProduct.productId,
          orderId,
          products.find((product) => product.id === cartProduct.productId)?.price || 0,
          cartProduct.amount,
        )
      )
    );
  }

  async createOrder(
    createOrder: CreateOrderDTO,
    userId: number,
  ): Promise<OrderEntity> {
    const cart = await this.cartService.findCardByUserId(userId, true);
    const products = await this.productService.findAll(
      cart.cartProduct?.map((cartProduct) => cartProduct.productId)
    );

    const payment: PaymentEntity = await this.paymentService.createPayment(
      createOrder,
      products,
      cart,
    );

    const order: OrderEntity = await this.saveOrder(createOrder, userId, payment);

    await this.createOrderProductUsingCart(cart, order.id, products);

    await this.cartService.clearCart(userId);

    return order;
  }

  async findOrdersByUserId(userId?: number, orderId?: number): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      where: {
        userId,
        id: orderId,
      },
      relations: {
        address: true,
        orderProduct: {
          product: true,
        },
        payment: {
          paymentStatus: true,
        },
        user: !!orderId,
      }
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException(`Orders not found`);
    }

    return orders;
  }

  async findAllOrders(): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      relations: {
        user: true,
      }
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Orders not found')
    }

    const ordersProduct = await this.orderProductService.findAmountProductsByOrderId(
      orders.map((order) => order.id)
    )

    return orders.map((order) => {
      const orderProduct = ordersProduct
        .find((currentOrder) => currentOrder.order_id === order.id)

      if (orderProduct) {
        return {
          ...order,
          amountProducts: Number(orderProduct.total)
        }
      }

      return order;
    });
  }
}
