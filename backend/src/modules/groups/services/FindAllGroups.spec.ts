import { ObjectId } from 'mongodb';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import IGroupRepository from '../repositories/IGroupRepository';
import FakeGroupRepository from '../repositories/fakes/FakeGroupRepository';
import FindAllGroupsService from './FindAllGroups';

let fakeGroupRepository: IGroupRepository;
let fakeCacheProvider: ICacheProvider;

let findAllGroups: FindAllGroupsService;

describe('FindAllGroups', () => {
  beforeEach(() => {
    fakeGroupRepository = new FakeGroupRepository();
    fakeCacheProvider = new FakeCacheProvider();

    findAllGroups = new FindAllGroupsService(
      fakeGroupRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to list all groups', async () => {
    const group1 = await fakeGroupRepository.create({
      name: 'valid-group-name',
      currentId: 123456,
      pastId: 0,
      product: new ObjectId(),
      productId: 123654,
    });

    const group2 = await fakeGroupRepository.create({
      name: 'valid-group-name',
      currentId: 1234567,
      pastId: 0,
      product: new ObjectId(),
      productId: 1234654,
    });

    jest
      .spyOn<ICacheProvider, any>(fakeCacheProvider, 'recover')
      .mockImplementationOnce(() => {
        return [group1, group2];
      });

    const groups = await findAllGroups.execute();

    expect(groups).toEqual([group1, group2]);

    jest
      .spyOn<ICacheProvider, any>(fakeCacheProvider, 'recover')
      .mockImplementationOnce(() => {
        return undefined;
      });

    const groupOutCache = await findAllGroups.execute();

    expect(groupOutCache).toEqual([group1, group2]);
  });

  it('Should be able to list all groups filtered', async () => {
    const group1 = await fakeGroupRepository.create({
      name: 'valid-group-name',
      currentId: 123456,
      pastId: 0,
      product: null,
      productId: null,
    });

    await fakeGroupRepository.create({
      name: 'valid-group-name',
      currentId: 1234567,
      pastId: 0,
      product: new ObjectId(),
      productId: 1234654,
    });

    const groups = await findAllGroups.execute(true);

    expect(groups).toEqual([group1]);
  });
});
