import {
  ChildEntity,
  Column,
} from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { CreateOrderDTO } from 'src/order/dto/createOrder.dto';

@ChildEntity()
export class PaymentPixEntity extends PaymentEntity {
  @Column({ name: 'code', nullable: false })
  code: string;

  @Column({ name: 'date_payment', nullable: false })
  datePayment: Date;

  constructor(
    statuId: number,
    price: number,
    discount: number,
    finalPrice: number,
    createOrderDTO: CreateOrderDTO,
  ) {
    super(statuId, price, discount, finalPrice);
    this.code = createOrderDTO?.codePix || '';
    this.datePayment = new Date(createOrderDTO?.dataPayment || '')
  }
}