import { TelegrafContext } from 'telegraf/typings/context';

export default class ChatLink {
  constructor(private context: TelegrafContext) {
    this.context = context;
  }

  public async execute({ chatId }): Promise<string> {
    const link = await this.context.telegram.exportChatInviteLink(chatId);
    return link;
  }
}
