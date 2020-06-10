import { ObjectId } from 'mongodb';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import IGroupRepository from '../repositories/IGroupRepository';
import FakeGroupRepository from '../repositories/fakes/FakeGroupRepository';
import FindGroupByTgIdService from './FindGroupByTgIdService';

let fakeGroupRepository: IGroupRepository;
let fakeCacheProvider: ICacheProvider;

let findGroup: FindGroupByTgIdService;

describe('findGroup', () => {
  beforeEach(() => {
    fakeGroupRepository = new FakeGroupRepository();
    fakeCacheProvider = new FakeCacheProvider();

    findGroup = new FindGroupByTgIdService(
      fakeGroupRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to an especific group', async () => {
    const group1 = await fakeGroupRepository.create({
      name: 'valid-group-name',
      currentId: 123456,
      pastId: 0,
      product: new ObjectId(),
      productId: 123654,
    });

    await fakeGroupRepository.create({
      name: 'valid-group-name',
      currentId: 1234567,
      pastId: 0,
      product: new ObjectId(),
      productId: 1234654,
    });

    const cache = jest.spyOn(fakeCacheProvider, 'recover');

    expect(
      await findGroup.execute({
        groupTgId: 123456,
      }),
    ).toBe(group1);

    expect(cache).toBeCalledWith(`FindGroupByTgId:${123456}`);
  });
});
