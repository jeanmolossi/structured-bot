import { container } from 'tsyringe';
import { isNull } from 'util';
import { IncomingMessage } from 'telegraf/typings/telegram-types';
import { TelegrafContext } from 'telegraf/typings/context';

import GetUsersDefaultIdsService from '@modules/user/services/GetUsersDefaultIdsService';

import KickChatMember from './KickChatMember';

interface IRequest {
  incomingMessage: IncomingMessage;
  context: TelegrafContext;
  [key: string]: any;
}

export default class NewChatMembersService {
  public async execute({
    incomingMessage,
    chatId,
    context,
  }: IRequest): Promise<boolean> {
    const getUsersIds = container.resolve(GetUsersDefaultIdsService);
    const ids = await getUsersIds.execute();
    let kicked = false;
    if (!isNull(ids)) {
      const kickChatMember = new KickChatMember(context);
      incomingMessage.new_chat_members.map(async member => {
        const new_chat_id = String(member.id);
        if (!ids.includes(new_chat_id)) {
          kicked = await kickChatMember.execute({
            chatId,
            userId: new_chat_id,
          });
        }
      });
    }
    return kicked;
  }
}
