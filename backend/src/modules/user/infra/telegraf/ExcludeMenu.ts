import State from '@shared/infra/api/telegrafSession';
import TelegrafInlineMenu from 'telegraf-inline-menu/dist/source';
import IUserModel from '@modules/user/entities/IUserModel';
import { container } from 'tsyringe';
import FindUserByTgIdService from '@modules/user/services/FindUserByTgIdService';

let dbUser: IUserModel = null;
let tgId: string = null;

const ExcludeMenu = new TelegrafInlineMenu(async _context => {
  if (
    (_context.match && _context.match.input === 'exclude:cancel') ||
    State.getState(_context.update.message.from.id).canceledExclusion
  )
    return 'Cancelado! Você precisa esperar pelo menos 15 minutos para poder tentar esta ação novamente';

  if (tgId === null) tgId = String(_context.message?.from?.id);

  const findUser = container.resolve(FindUserByTgIdService);
  dbUser = await findUser.execute(String(tgId));

  const { transactions } = dbUser;

  const userDataMessage =
    `Dados de usuário:\n\nNome: ${dbUser.name}\n` +
    `E-mail: ${dbUser.email}\n` +
    `Telefone: ${dbUser.telefone}\n`;

  let list: string[] = [`\n\nVocê não tem dados registrados`];
  if (transactions.length >= 0) {
    list = transactions.map(
      transaction =>
        `\n\nDados registrados de compra:\n` +
        `Produto: ${transaction.produto.nome}\n` +
        `Compra: ${transaction.venda.codigo}\n` +
        `Plano: ${transaction.plano.nome}\n` +
        `Assinatura: ${transaction.assinatura.status}\n` +
        `Parcela da assinatura: ${transaction.assinatura.parcela}\n`,
    );
  }

  return (
    `Você tem certeza que deseja excluir sua conta?\n\n${userDataMessage}` +
    `${list.join('\n\n')}`
  );
});

ExcludeMenu.setCommand('excluir');

let tryies = 1;

ExcludeMenu.question('Confirmar exclusão', 'confirm', {
  uniqueIdentifier: String(Math.floor(Math.random() * 999)),
  questionText: 'Você tem certeza que deseja excluir sua conta?',
  setFunc: async (_, answer) => {
    if (new RegExp(/(confirmar|sim|ok)/gi).test(answer)) {
      await _.reply(`Sua resposta ${answer}`);
    } else {
      if (new RegExp(/(nao|não)/gi).test(answer)) {
        tryies += 2;
      }
      if (tryies > 2) {
        State.newState({ canceledExclusion: true }, tgId);
      } else {
        await _.reply(
          `Sua resposta não foi conclusiva para apagar sua conta\n` +
            `Tente responder com sim ou confirmar`,
        );
      }
      tryies += 1;
    }
  },
  hide: () => State.getState(tgId).canceledExclusion === true,
});

ExcludeMenu.button('Cancelar', 'cancel', {
  doFunc: async _context => {
    try {
      await _context.answerCbQuery('Cancelando...');
      State.newState({ canceledExclusion: true }, tgId);
      return true;
    } catch {
      return true;
    }
  },
  hide: () => State.getState(tgId).canceledExclusion === true,
  setMenuAfter: true,
});

export default ExcludeMenu.init({
  actionCode: 'exclude',
  backButtonText: 'Voltar',
  mainMenuButtonText: 'Voltar ao inicio',
});
