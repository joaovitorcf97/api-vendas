import { ReturnCategory } from "src/category/dto/returnCategory.dto";
import { ProductEntity } from "../entities/product.entity";

export class ReturnProductDTO {
  id: number;
  name: string;
  price: number;
  image: string;
  weight: number;
  length: number;
  height: number;
  width: number;
  diameter: number;
  category?: ReturnCategory;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.image = product.image;
    this.weight = product.weight;
    this.length = product.length;
    this.height = product.height;
    this.width = product.width;
    this.diameter = product.diameter;
    this.category = product.category
      ? new ReturnCategory(product.category)
      : undefined;
  }
}