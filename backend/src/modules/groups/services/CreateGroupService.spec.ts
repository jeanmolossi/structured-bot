import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ObjectId } from 'mongodb';
import AppError from '@shared/errors/AppError';
import IGroupRepository from '../repositories/IGroupRepository';
import FakeGroupRepository from '../repositories/fakes/FakeGroupRepository';
import CreateGroupService from './CreateGroupService';

let fakeGroupRepository: IGroupRepository;
let fakeCacheProvider: ICacheProvider;

let createGroup: CreateGroupService;

describe('CreateGroup', () => {
  beforeEach(() => {
    fakeGroupRepository = new FakeGroupRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createGroup = new CreateGroupService(
      fakeGroupRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to create new Group', async () => {
    const group = await createGroup.execute({
      name: 'valid-group-name',
      currentId: 123456,
      pastId: 0,
      product: new ObjectId(),
      productId: 123456,
    });

    expect(group).toHaveProperty('id');
  });

  it('Should not be able to create new Group if thats already exists', async () => {
    await createGroup.execute({
      name: 'valid-group-name',
      currentId: 123456,
      pastId: 0,
      product: new ObjectId(),
      productId: 123456,
    });

    await expect(
      createGroup.execute({
        name: 'valid-group-name',
        currentId: 123456,
        pastId: 0,
        product: new ObjectId(),
        productId: 123456,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
