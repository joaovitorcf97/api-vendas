import {
  ChildEntity,
  Column,
  Entity,
} from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { CreateOrderDTO } from 'src/order/dto/createOrder.dto';

@ChildEntity()
export class PaymentCreditCardEntity extends PaymentEntity {
  @Column({ name: 'amount_payments', nullable: false })
  amountPayments: number;

  constructor(
    statuId: number,
    price: number,
    discount: number,
    finalPrice: number,
    createOrderDTO: CreateOrderDTO,
  ) {
    super(statuId, price, discount, finalPrice);
    this.amountPayments = createOrderDTO?.amountPayments || 0;
  }
}