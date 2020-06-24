import { ObjectID, ObjectId } from 'mongodb';

export default interface IGroupModel {
  id: ObjectId;
  name: string;
  product: ObjectID;
  productId: number;
  currentId: number;
  pastId: number;
}
