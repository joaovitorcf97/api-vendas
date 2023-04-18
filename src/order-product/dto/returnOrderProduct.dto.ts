import { ReturnOrderDTO } from "src/order/dto/returnOrder.dto";
import { ReturnProductDTO } from "src/product/dto/returnProduct";
import { OrderProductEntity } from "../entities/orderProduct.entity";


export class ReturnOrderProductDTO {
  id: number;
  orderId: number;
  productId: number;
  amount: number;
  price: number;
  order?: ReturnOrderDTO;
  product?: ReturnProductDTO;

  constructor(orderProduct: OrderProductEntity) {
    this.id = orderProduct.id;
    this.orderId = orderProduct.orderId;
    this.productId = orderProduct.productId;
    this.amount = orderProduct.amount;
    this.price = orderProduct.price;
    this.order = orderProduct.orders ? new ReturnOrderDTO(orderProduct.orders) : undefined;
    this.product = orderProduct.product ? new ReturnProductDTO(orderProduct.product) : undefined;
  }
}