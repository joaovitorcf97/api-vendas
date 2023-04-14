import { CartEntity } from "src/cart/entities/cart.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'cart_product' })
export class CartProductEntity {
  @PrimaryGeneratedColumn("rowid")
  id: number;

  @Column({ name: 'card_id', nullable: false })
  card_id: number;

  @Column({ name: 'product_id', nullable: false })
  product_id: number;

  @Column({ name: 'amount', nullable: false })
  amount: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ProductEntity, (productEntity: ProductEntity) => productEntity.cartProduct)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;

  @ManyToOne(() => CartEntity, (cart: CartEntity) => cart.cartProduct)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart?: CartEntity;
}