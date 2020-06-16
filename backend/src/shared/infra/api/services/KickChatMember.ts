import { TelegrafContext } from 'telegraf/typings/context';

interface IRequest {
  userId: number | string;
  chatId: number;
  untilDate?: number;
}

export default class KickChatMember {
  private context: TelegrafContext;

  constructor(context: TelegrafContext) {
    this.context = context;
  }

  public async execute({
    userId,
    chatId,
    untilDate,
  }: IRequest): Promise<boolean> {
    const chat = await this.context.telegram.getChat(chatId);

    if (chat.type === 'private') return false;

    const kick = await this.context.telegram.kickChatMember(
      chatId,
      Number(userId),
      untilDate,
    );

    return kick;
  }
}
