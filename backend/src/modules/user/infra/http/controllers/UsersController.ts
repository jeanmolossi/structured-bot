import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/user/services/CreateUserService';
import ShowUserByIdService from '@modules/user/services/ShowUserByIdService';

import UpdateUserService from '@modules/user/services/UpdateUserService';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const userData = request.body;

    const createUserService = container.resolve(CreateUserService);

    const newUser = await createUserService.execute(userData);

    return response.json(newUser);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();

    const allUsers = await usersRepository.findAll();

    return response.json(allUsers);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const { userRef } = request.query;

    const userInfoService = container.resolve(ShowUserByIdService);

    const userFound = await userInfoService.execute(userRef.toString());

    return response.json(userFound);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const updateUserService = container.resolve(UpdateUserService);

    const updatedUser = await updateUserService.execute(request.body);

    return response.json(updatedUser);
  }
}

export default UsersController;
