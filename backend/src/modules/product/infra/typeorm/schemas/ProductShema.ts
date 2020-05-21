import IProductModel from '@modules/product/entities/IProductModel';
import {
  ObjectID,
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
class ProductSchema implements IProductModel {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  productId: string;

  @Column()
  isActive: boolean;

  @Column()
  isSync: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}

export default ProductSchema;
