import { ReturnUserDTO } from "src/user/dto/returnUser.dto";
import { OrderEntity } from "../entities/order.entity";

export class ReturnOrderDTO {
  id: number;
  date: string;
  user?: ReturnUserDTO;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDTO(order.user) : undefined;
  }
}