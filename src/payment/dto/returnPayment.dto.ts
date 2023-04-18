import { PaymentStatusEntity } from "src/payment-status/entities/paymentStatus.entity";
import { PaymentEntity } from "../entities/payment.entity";
import { ReturnPaymentStatusDTO } from "src/payment-status/dto/returnPaymentStatus.dto";

export class ReturnPaymentoDTO {
  id: number;
  statusId: number;
  price: number;
  discount: number;
  finalPrice: number;
  type: string;
  paymentStatus?: ReturnPaymentStatusDTO;

  constructor(payment: PaymentEntity) {
    this.id = payment.id;
    this.statusId = payment.statusId;
    this.price = payment.price;
    this.discount = payment.discount;
    this.finalPrice = payment.finalPrice;
    this.type = payment.type;
    this.paymentStatus = payment.paymentStatus ? new ReturnPaymentStatusDTO(payment.paymentStatus) : undefined;
  }
}