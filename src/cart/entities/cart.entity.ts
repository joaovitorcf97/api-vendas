import { CartProductEntity } from "src/cart-product/entities/cartProduct.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'cart' })
export class CartEntity {
  @PrimaryGeneratedColumn("rowid")
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'active', nullable: false })
  active: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CartProductEntity, (cardProduct) => cardProduct.cart)
  cartProduct: CartProductEntity[];
}