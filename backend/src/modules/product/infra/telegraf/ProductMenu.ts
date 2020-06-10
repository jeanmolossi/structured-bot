import TelegrafInlineMenu from 'telegraf-inline-menu';
import { container } from 'tsyringe';

import State from '@shared/infra/api/telegrafSession';
import IUserModel from '@modules/user/entities/IUserModel';
import IGroupModel from '@modules/groups/entities/IGroupModel';
import FindAllGroups from '@modules/groups/services/FindAllGroups';
import IProductModel from '@modules/product/entities/IProductModel';
import FindProductService from '@modules/product/services/FindProductsService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';
import GroupSchema from '@modules/groups/infra/typeorm/schemas/GroupSchema';
import FindUserByTgIdService from '@modules/user/services/FindUserByTgIdService';
import ProductSchema from '../typeorm/schemas/ProductShema';

let dbUser: IUserModel;
let tgId: string;
let groups: IGroupModel[];
let products: IProductModel[];

let selectedGroup: GroupSchema = {} as GroupSchema;
let selectedProduct: ProductSchema = {} as ProductSchema;

let hideSelects = false;

const ProductMenu = new TelegrafInlineMenu(async _context => {
  tgId = String(_context.from?.id);

  const { fromUser } = State.getState(tgId);
  const findUser = container.resolve(FindUserByTgIdService);
  dbUser = await findUser.execute(String(tgId));

  if (!(dbUser.isAdmin || dbUser.isSupport)) {
    hideSelects = true;
    return `Somente administradores podem usar este comando, desculpe`;
  }

  if (dbUser === null || dbUser === undefined) {
    hideSelects = true;
    return `${fromUser.first_name}, envie seus dados em /start antes de acessar este menu`;
  }

  const findGroups = container.resolve(FindAllGroups);
  groups = await findGroups.execute();

  const findProducts = container.resolve(FindProductService);
  products = await findProducts.execute({ hasSync: false });

  if (hideSelects) return `Você sincronizou com sucesso. Obrigado`;

  return `Bem vindo à sincronização de produto, vamos iniciar?`;
});

ProductMenu.setCommand('produto');

const Grupos = new TelegrafInlineMenu('Grupos');

Grupos.select('sg', () => Object.keys(groups), {
  setFunc: (_context, _key) => {
    selectedGroup = groups[_key];
  },
  textFunc: (_, _key) => {
    return groups[_key].name;
  },
  columns: 1,
  isSetFunc: () => {
    console.log(selectedGroup);
    return !!(selectedGroup && selectedGroup.name);
  },
  setParentMenuAfter: true,
});

ProductMenu.submenu(
  () => {
    if (selectedGroup && selectedGroup.name)
      return `Grupos - ${selectedGroup.name}`;
    return 'Grupos';
  },
  'sgs',
  Grupos,
  {
    hide: () => hideSelects,
  },
);

const Produtos = new TelegrafInlineMenu('Produtos');

ProductMenu.submenu(
  () => {
    if (selectedProduct && selectedProduct.name)
      return `Produtos - ${selectedProduct.name}`;
    return 'Produtos';
  },
  'sps',
  Produtos,
  {
    hide: () => hideSelects,
  },
);

Produtos.select('sp', () => Object.keys(products), {
  setFunc: (_context, _key) => {
    console.log(products[_key], '>> SELECTED KEY');
    selectedProduct = products[_key];
  },
  textFunc: (_, _key) => {
    return products[_key].name;
  },
  isSetFunc: () => {
    return !!(selectedProduct && selectedProduct.name);
  },
  setParentMenuAfter: true,
});

ProductMenu.button('Sincronizar', 'fsync', {
  doFunc: async _context => {
    console.log(
      `>> ENVIANDO DADOS >> ${JSON.stringify(
        selectedGroup,
      )} & >> & ${selectedProduct}`,
    );

    const updateGroup = container.resolve(UpdateGroupService);
    await updateGroup.execute({
      ...selectedGroup,
      productId: Number(selectedProduct.productId),
      product: selectedProduct.id,
    });

    await _context.answerCbQuery('Sincronizando...');

    await _context.editMessageText(
      `O Grupos ${selectedGroup.name} foi sincronizado com o produto ${selectedProduct.name}`,
    );

    hideSelects = true;
  },
  hide: () => !(selectedProduct.name && selectedGroup.name) || hideSelects,
  setMenuAfter: false,
});

export default ProductMenu.init({
  actionCode: 'produto',
  backButtonText: 'Voltar',
  mainMenuButtonText: 'Voltar ao início',
});

/**
 * BUSCAR GRUPOS SEM PRODUTO
 * BUSCAR PRODUTOS
 */
