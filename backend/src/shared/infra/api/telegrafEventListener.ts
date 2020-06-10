import { TelegrafContext } from 'telegraf/typings/context';
import { isNull } from 'util';
import { ObjectId } from 'mongodb';

import { container } from 'tsyringe';
import CreateGroupService from '@modules/groups/services/CreateGroupService';
import FindUserByTgIdService from '@modules/user/services/FindUserByTgIdService';
import TelegrafEventListener from './telegrafUpdateEmitter';
import AppState from './telegrafSession';

import KickChatMember from './services/KickChatMember';
import inRoute from './routes';
import NewChatMembersService from './services/NewChatMembersService';
import FilterTransactionsService from './services/FilterTransactionsService';
import FindGroupApiService from './services/FindGroupApiService';
import MigrateChatService from './services/MigrateChatService';

const EventListener = TelegrafEventListener;

const listenerRegister = (_context: TelegrafContext): void => {
  let messageContent = _context.message;
  if (!messageContent) messageContent = _context.update.message;
  if (!messageContent) messageContent = _context.update.callback_query.message;

  const kickChatMember = new KickChatMember(_context);

  const interactGroup = !!AppState.getState(messageContent.from.id)
    .interactingGroupExists;

  const findUserByTgId = container.resolve(FindUserByTgIdService);

  EventListener.on(
    'text new_chat_members',
    async (context: TelegrafContext) => {
      const userId = messageContent.from.id;
      const chatId = messageContent.chat.id;
      const chatType = messageContent.chat.type;

      const userFromDb = await findUserByTgId.execute(String(userId));

      let kicked = false;

      if (isNull(userFromDb)) {
        kicked = await kickChatMember.execute({ chatId, userId });
      }
      // IF NEW CHAT MEMBERS ADDED
      const newchatmembers = new NewChatMembersService();
      kicked = await inRoute({
        routes: 'new_chat_members',
        callback: newchatmembers.execute,
        params: {
          context,
          incomingMessage: messageContent,
          chatId,
        },
      });

      // TRANSACTIONS VERIFY
      if (!kicked && userFromDb.transactions) {
        const filterTransactionsService = new FilterTransactionsService();
        kicked = await inRoute({
          routes: 'text new_chat_members',
          callback: filterTransactionsService.execute,
          params: {
            context,
            incomingMessage: messageContent,
            userId,
            chatId,
            userFromDb,
          },
        });
      }

      if (!kicked && !userFromDb.transactions && chatType !== 'private') {
        kicked = await kickChatMember.execute({ chatId, userId });
      }

      /**
       * @VERIFY_IF_ARE_PRODUCT_INSIDE_GROUP
       */

      let group = null;
      let product = AppState.getState(userId).productInGroup || null;
      const isPrivateChat = chatType === 'private';

      // INTERACT MUST BE UNDEFINED OR FALSE
      if (!isPrivateChat && (userFromDb.isAdmin || userFromDb.isSupport)) {
        if (!interactGroup) {
          const findGroupApiService = new FindGroupApiService();
          const findGroup = await inRoute({
            routes: 'text new_chat_members',
            callback: findGroupApiService.execute,
            params: {
              incomingMessage: messageContent,
              groupTgId: chatId,
            },
          });

          group = !!findGroup; // FOUND GROUP > TRUE // NOT FOUND GROUP > FALSE
          product = findGroup && findGroup.product;

          AppState.newState({ interactingGroupExists: true }, userId);
          AppState.newState({ productInGroup: product }, userId);
        }
        if (interactGroup && (!group || isNull(group))) {
          group = true;
        }

        if (!group) {
          const createGroup = container.resolve(CreateGroupService);
          createGroup
            .execute({
              name: messageContent.chat.title,
              currentId: chatId,
              pastId: 0,
              product: null,
              productId: null,
            })
            .then(created => {
              group = !!created;
              product = created.product;
              AppState.newState({ interactingGroupExists: true }, userId);
              AppState.newState({ productInGroup: product }, userId);
            })
            .catch(_ => {
              AppState.newState({ interactingGroupExists: true }, userId);
            });
        }
        if (group && (!product || isNull(product))) {
          await _context.replyWithMarkdown(
            `Adicione um produto à este grupo\nPara isso use (*NO PRIVADO COMIGO*) o comando /produto`,
          );
        }
      }
    },
  );

  EventListener.on('group_chat_created', async _ => {
    const chatId = messageContent.chat.id;
    const userId = messageContent.from.id;

    let product: ObjectId | boolean;

    const createGroup = container.resolve(CreateGroupService);
    createGroup
      .execute({
        name: messageContent.chat.title,
        currentId: chatId,
        pastId: 0,
        product: null,
        productId: null,
      })
      .then(created => {
        product = created.product;
        AppState.newState({ interactingGroupExists: true }, userId);
        AppState.newState({ productInGroup: product }, userId);
      })
      .catch(__ => {
        AppState.newState({ interactingGroupExists: true }, userId);
      });
  });

  EventListener.on(
    'migrate_to_chat_id migrate_from_chat_id',
    async (context: TelegrafContext) => {
      // eslint-disable-next-line no-console
      console.log(
        messageContent,
        '>> MIGRATE CONTENT shared/infra/api/telegrafEventListener',
      );

      const userId = messageContent.from.id;

      const userFromDb = await findUserByTgId.execute(String(userId));

      if (!userFromDb.isAdmin) return;

      let newChatId: number;
      let pastId: number;
      let title: string;

      let migrateIs = 'to';

      if ('migrate_from_chat_id' in messageContent) {
        migrateIs = 'from';
        newChatId = messageContent.chat.id;
        title = messageContent.chat.title;
        pastId = messageContent.migrate_from_chat_id;
      }

      const findGroupApiService = new FindGroupApiService();
      const group = await inRoute({
        routes: 'migrate_from_chat_id',
        callback: findGroupApiService.execute,
        params: {
          incomingMessage: messageContent,
          groupTgId: pastId,
        },
      });

      const migrageChatService = new MigrateChatService(context);
      inRoute({
        routes: 'migrate_from_chat_id',
        callback: migrageChatService.execute,
        params: {
          incomingMessage: messageContent,
          oldGroup: group,
          newGroup: {
            name: title,
            currentId: newChatId,
            pastId,
          },
          migrateIs,
        },
      })
        .then(updateGroup =>
          console.log(updateGroup, ' >> UPDATE GROUP IN MIGRATE'),
        )
        .catch(_ => console.log('Not updated'));
    },
  );
};

export default listenerRegister;
