import { ObjectId } from 'mongodb';

export default interface IUpdateGroupDTO {
  id: ObjectId;
  name: string;
  currentId: number;
  product: ObjectId;
  productId: number;
  pastId: number;
}
