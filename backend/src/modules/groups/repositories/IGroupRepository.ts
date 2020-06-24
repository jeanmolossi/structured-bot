import GroupSchema from '../infra/typeorm/schemas/GroupSchema';
import ICreateGroupDTO from '../dtos/ICreateGroupDTO';
import IFindParamDTO from '../dtos/IFindParamDTO';
import IGroupModel from '../entities/IGroupModel';
import IUpdateGroupDTO from '../dtos/IUpdateGroupDTO';

export default interface IGroupRepository {
  create(data: ICreateGroupDTO): Promise<IGroupModel>;
  findGroupByProductId(productId: number): Promise<IGroupModel | null>;
  findByGroupTgId(groupTgId: number): Promise<IGroupModel | null>;
  findAll(findParam: IFindParamDTO): Promise<GroupSchema[] | null>;
  save(data: IUpdateGroupDTO): Promise<GroupSchema>;
}
