import IGroupModel from '@modules/groups/entities/IGroupModel';
import { ObjectID } from 'mongodb';
import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('groups')
export default class Group implements IGroupModel {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  product: ObjectID;

  @Column()
  productId: number;

  @Column()
  currentId: number;

  @Column()
  pastId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
