import { ObjectId } from 'mongodb';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import AppError from '@shared/errors/AppError';
import IGroupRepository from '../repositories/IGroupRepository';
import FakeGroupRepository from '../repositories/fakes/FakeGroupRepository';
import UpdateGroupService from './UpdateGroupService';

let fakeGroupRepository: IGroupRepository;
let fakeCacheProvider: ICacheProvider;

let updateGroup: UpdateGroupService;

describe('UpdateGroup', () => {
  beforeEach(() => {
    fakeGroupRepository = new FakeGroupRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateGroup = new UpdateGroupService(
      fakeGroupRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to update a group', async () => {
    const createdGroup = await fakeGroupRepository.create({
      name: 'valid-group-name',
      currentId: 123456,
      pastId: 0,
      product: new ObjectId(),
      productId: 123654,
    });

    const updatedGroup = await updateGroup.execute({
      id: createdGroup.id,
      name: 'valid-group-name-2',
      currentId: 1234567,
      pastId: 123456,
      product: new ObjectId(),
      productId: 123654,
    });

    expect(updatedGroup.name).toBe('valid-group-name-2');
    expect(updatedGroup.currentId).toBe(1234567);
    expect(updatedGroup.pastId).toBe(123456);
  });

  it('Should not be able to update a group with an taken Telegram id', async () => {
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
      productId: 123654,
    });

    await expect(
      updateGroup.execute({
        id: group1.id,
        name: 'valid-group-name',
        currentId: 1234567,
        pastId: 123456,
        product: new ObjectId(),
        productId: 123654,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able update unexistent group', async () => {
    await expect(
      updateGroup.execute({
        id: new ObjectId(),
        name: 'valid-group-name',
        currentId: 123456,
        pastId: 123456,
        product: new ObjectId(),
        productId: 123654,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
