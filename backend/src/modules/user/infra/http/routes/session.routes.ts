import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/user/services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/:tgId', async (request: Request, response: Response) => {
  const { tgId } = request.params;
  const { email, password } = request.body;

  const authenticateUser = container.resolve(AuthenticateUserService);

  const UserAndTokenPayload = await authenticateUser.execute({
    tgId,
    email,
    password,
  });

  return response.json(UserAndTokenPayload);
});

export default sessionsRouter;
