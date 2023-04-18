import { ReturnCategory } from "src/category/dto/returnCategory.dto";
import { ProductEntity } from "../entities/product.entity";

export class ReturnProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: ReturnCategory;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.image = product.image;
    this.category = product.category
      ? new ReturnCategory(product.category)
      : undefined;
  }
}