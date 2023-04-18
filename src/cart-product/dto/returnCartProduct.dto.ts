import { ReturnCartDTO } from "src/cart/dto/returnCart.dto";
import { ReturnProductDTO } from "src/product/dto/returnProduct";
import { CartProductEntity } from "../entities/cartProduct.entity";

export class ReturnCartProductDTO {
  id: number;
  cartId: number;
  productId: number;
  amount: number;
  product?: ReturnProductDTO;
  cart?: ReturnCartDTO;

  constructor(cartProduct: CartProductEntity) {
    this.id = cartProduct.id;
    this.cartId = cartProduct.cartId;
    this.productId = cartProduct.productId;
    this.amount = cartProduct.amount;
    this.product = cartProduct.product
      ? new ReturnProductDTO(cartProduct.product)
      : undefined;
    this.cart = cartProduct.cart
      ? new ReturnCartDTO(cartProduct.cart)
      : undefined;
  }
}