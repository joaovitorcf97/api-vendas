import { ReturnUserDTO } from "src/user/dto/returnUser.dto";
import { OrderEntity } from "../entities/order.entity";
import { ReturnAddressDTO } from "src/address/dto/returnAddress.dto";
import { ReturnPaymentoDTO } from "src/payment/dto/returnPayment.dto";
import { OrderProductEntity } from "src/order-product/entities/orderProduct.entity";

export class ReturnOrderDTO {
  id: number;
  date: string;
  user?: ReturnUserDTO;
  address?: ReturnAddressDTO;
  payment?: ReturnPaymentoDTO;
  ordersProduct?: OrderProductEntity[];

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDTO(order.user) : undefined;
    this.address = order.address ? new ReturnAddressDTO(order.address) : undefined;
    this.payment = order.payment ? new ReturnPaymentoDTO(order.payment) : undefined;
    this.ordersProduct = order.orderProduct;
  }
}