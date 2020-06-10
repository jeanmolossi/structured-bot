import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ObjectIdColumn,
} from 'typeorm';
import { ObjectID } from 'mongodb';
import {
  IDadosVenda,
  IDadosProduto,
  IDadosPostback,
  IDadosPlano,
  IDadosAssinatura,
  IDadosComprador,
  IDadosProdutor,
} from '@modules/product/providers/MonetizzeProvider/models/IMonetizzeResponse';

@Entity()
class TransactionSchema {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  chave_unica?: string;

  @Column()
  produto?: IDadosProduto;

  @Column()
  tipoPostback?: IDadosPostback;

  @Column()
  venda?: IDadosVenda;

  @Column()
  plano?: IDadosPlano;

  @Column()
  url_recuperacao?: string;

  @Column()
  assinatura?: IDadosAssinatura;

  @Column()
  comprador?: IDadosComprador;

  @Column()
  produtor?: IDadosProdutor;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}

export default TransactionSchema;
