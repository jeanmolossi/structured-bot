import IGroupModel from '../entities/IGroupModel';
import ICreateGroupDTO from '../dtos/ICreateGroupDTO';
import IFindParamDTO from '../dtos/IFindParamDTO';

export default interface IGroupRepository {
  create(data: ICreateGroupDTO): Promise<IGroupModel>;
  findGroupByProductId(productId: number): Promise<IGroupModel | null>;
  findByGroupTgId(groupTgId: number): Promise<IGroupModel | null>;
  findAll(findParam: IFindParamDTO): Promise<IGroupModel[] | null>;
  save(data: IGroupModel): Promise<IGroupModel>;
}
