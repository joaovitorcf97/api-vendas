import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/order/dto/createOrder.dto';
import { PaymentCreditCardEntity } from './entities/paymentCard.entity';
import { PaymentType } from './enum/paymenttype.enum';
import { PaymentPixEntity } from './entities/paymentPix.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CartProductEntity } from 'src/cart-product/entities/cartProduct.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ) { }

  async createPayment(
    createOrderDTO: CreateOrderDTO,
    products: ProductEntity[],
    cart: CartEntity,
  ): Promise<PaymentEntity> {
    const finalPrice = cart.cartProduct?.map((cartProdutc: CartProductEntity) => {
      const product = products.find((product) => product.id === cartProdutc.productId);

      if (product) {
        return cartProdutc.amount * product.price;
      }

      return 0;
    },).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    if (createOrderDTO.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDTO
      );

      return this.paymentRepository.save(paymentCreditCard)
    } else if (createOrderDTO.codePix && createOrderDTO.dataPayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDTO
      );

      return this.paymentRepository.save(paymentPix)
    }

    throw new BadRequestException(`Amount Payments or Pix or date payment not found.`)
  }
}
