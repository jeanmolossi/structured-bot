import IUserModel from '@modules/user/entities/IUserModel';
import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
class UserSchema implements IUserModel {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column()
  cpf: string;

  @Column()
  password: string;

  @Column()
  tgId: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}

export default UserSchema;
