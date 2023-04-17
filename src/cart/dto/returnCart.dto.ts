import { CartProductEntity } from "src/cart-product/entities/cartProduct.entity";
import { CartEntity } from "../entities/cart.entity";
import { ReturnCartProductDTO } from "src/cart-product/dto/returnCartProduct.dto";

export class ReturnCartDTO {
  id: number;
  cartProduct?: ReturnCartProductDTO[];

  constructor(cart: CartEntity) {
    this.id = cart.id;
    this.cartProduct = cart.cartProduct
      ? cart.cartProduct.map((cartProduct) => new ReturnCartProductDTO(cartProduct))
      : undefined;
  }
}