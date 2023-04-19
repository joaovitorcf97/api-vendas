import { ReturnProductDTO } from "src/product/dto/returnProduct";
import { CategoryEntity } from "../entities/category.entity";

export class ReturnCategory {
  id: number;
  name: string;
  amountProducts?: number;
  products?: ReturnProductDTO[];

  constructor(categoryEntity: CategoryEntity, amountProducts?: number) {
    this.id = categoryEntity.id;
    this.name = categoryEntity.name;
    this.amountProducts = amountProducts;
    this.products = categoryEntity?.products
      ? categoryEntity.products.map((product) => new ReturnProductDTO(product))
      : undefined
  }
}