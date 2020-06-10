import { ObjectID } from 'mongodb';

export default interface ICreateGroupDTO {
  name: string;
  product: ObjectID;
  productId: number;
  currentId: number;
  pastId: number;
}
