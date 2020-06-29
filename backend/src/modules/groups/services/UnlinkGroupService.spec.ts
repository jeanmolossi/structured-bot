import { ObjectId } from 'mongodb';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import AppError from '@shared/errors/AppError';
import IGroupRepository from '../repositories/IGroupRepository';
import FakeGroupRepository from '../repositories/fakes/FakeGroupRepository';
import UnlinkGroupService from './UnlinkGroupService';

let fakeGroupRepository: IGroupRepository;
let fakeCacheProvider: ICacheProvider;

let updateGroup: UnlinkGroupService;

describe('UnlinkGroup', () => {
  beforeEach(() => {
    fakeGroupRepository = new FakeGroupRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateGroup = new UnlinkGroupService(
      fakeGroupRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to unlink a group sync', async () => {
    const groupCreated = await fakeGroupRepository.create({
      name: 'valid-group-name',
      currentId: 123456,
      pastId: 0,
      product: new ObjectId(),
      productId: 123654,
    });

    const updatedGroup = await updateGroup.execute(groupCreated.currentId);

    expect(updatedGroup.currentId).toBe(123456);
    expect(updatedGroup.product).toBeNull();
  });

  it('Should not be able to update a group without an existing Telegram id', async () => {
    await expect(updateGroup.execute(1234567)).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to unlink a group without an product sync', async () => {
    await fakeGroupRepository.create({
      name: 'valid-group-name',
      currentId: 123456,
      pastId: 0,
      product: null,
      productId: null,
    });

    await expect(updateGroup.execute(123456)).rejects.toBeInstanceOf(AppError);
  });
});
