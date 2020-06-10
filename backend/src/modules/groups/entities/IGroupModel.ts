import { ObjectID } from 'mongodb';

export default interface IGroupModel {
  name: string;
  product: ObjectID;
  productId: number;
  currentId: number;
  pastId: number;
}
