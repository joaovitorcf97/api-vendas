import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/order/dto/createOrder.dto';
import { PaymentCreditCardEntity } from './entities/paymentCard.entity';
import { PaymentType } from './enum/paymenttype.enum';
import { PaymentPixEntity } from './entities/paymentPix.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ) { }

  async createPayment(createOrderDTO: CreateOrderDTO): Promise<PaymentEntity> {
    if (createOrderDTO.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done,
        0,
        0,
        0,
        createOrderDTO
      );

      return this.paymentRepository.save(paymentCreditCard)
    } else if (createOrderDTO.codePix && createOrderDTO.dataPayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        0,
        0,
        0,
        createOrderDTO
      );

      return this.paymentRepository.save(paymentPix)
    }

    throw new BadRequestException(`Amount Payments or Pix or date payment not found.`)
  }
}
