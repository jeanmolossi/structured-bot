import { container, injectable, inject } from 'tsyringe';
import { ContextNextFunc } from 'telegraf-inline-menu/dist/source/generic-types';

import IUserModel from '@modules/user/entities/IUserModel';
import IGroupModel from '@modules/groups/entities/IGroupModel';
import FindAllGroups from '@modules/groups/services/FindAllGroups';
import IProductModel from '@modules/product/entities/IProductModel';
import FindProductService from '@modules/product/services/FindProductsService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';
import GroupSchema from '@modules/groups/infra/typeorm/schemas/GroupSchema';
import FindUserByTgIdService from '@modules/user/services/FindUserByTgIdService';
import IMenuTelegrafProvider from '@shared/container/providers/MenuTelegrafProvider/models/IMenuTelegrafProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ProductSchema from '../typeorm/schemas/ProductShema';

@injectable()
class UserProductMenu {
  constructor(
    @inject('MenuTelegrafProvider')
    private menuTelegrafInline: IMenuTelegrafProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<ContextNextFunc> {
    let dbUser: IUserModel;
    let tgId: string;
    let groups: IGroupModel[];
    let products: IProductModel[];

    let selectedGroup: GroupSchema = {} as GroupSchema;
    let selectedProduct: ProductSchema = {} as ProductSchema;

    let hideSelects =
      (await this.cacheProvider.recover<boolean>(`hideSelects`)) || false;

    this.menuTelegrafInline.setOptions({
      command: 'produto',
      initializer: async _context => {
        tgId = String(_context.from?.id);

        const { first_name } = this.menuTelegrafInline.getFromUser(_context);
        const findUser = container.resolve(FindUserByTgIdService);
        dbUser = await findUser.execute(String(tgId));

        if (!(dbUser.isAdmin || dbUser.isSupport)) {
          this.cacheProvider.save('hideSelects', true);
          return `Somente administradores podem usar este comando, desculpe`;
        }

        if (dbUser === null || dbUser === undefined) {
          this.cacheProvider.save('hideSelects', true);
          return `${first_name}, envie seus dados em /start antes de acessar este menu`;
        }

        const findGroups = container.resolve(FindAllGroups);
        groups = await findGroups.execute(true);

        const findProducts = container.resolve(FindProductService);
        products = await findProducts.execute({ hasSync: true });

        if (hideSelects) return `Você sincronizou com sucesso. Obrigado`;

        return `Bem vindo à sincronização de produto, vamos iniciar?`;
      },
    });

    this.menuTelegrafInline.addSelect({
      submenuProps: {
        message: 'Grupos que não tem produto sincronizado',
        text: (): string => {
          if (selectedGroup && selectedGroup.name)
            return `Grupos - ${selectedGroup.name}`;
          return 'Grupos';
        },
        action: 'sgs',
        additionalArgs: {
          hide: (): boolean => hideSelects,
        },
      },
      selectProps: {
        action: 'sg',
        options: (): Array<string> => Object.keys(groups),
        additionalArgs: {
          setFunc: (_context, _key): void => {
            selectedGroup = groups[_key];
          },
          textFunc: (_, _key): string => {
            return groups[_key].name;
          },
          columns: 1,
          isSetFunc: (): boolean => {
            // console.log(selectedGroup);
            return !!(selectedGroup && selectedGroup.name);
          },
          setParentMenuAfter: true,
        },
      },
    });

    this.menuTelegrafInline.addSelect({
      submenuProps: {
        message: 'Seus produtos',
        text: (): string => {
          if (selectedProduct && selectedProduct.name)
            return `Produtos - ${selectedProduct.name}`;
          return 'Produtos';
        },
        action: 'sps',
        additionalArgs: {
          hide: (): boolean => hideSelects,
        },
      },
      selectProps: {
        action: 'sp',
        options: (): Array<string> => Object.keys(products),
        additionalArgs: {
          setFunc: (_context, _key): void => {
            // console.log(products[_key], '>> SELECTED KEY');
            selectedProduct = products[_key];
          },
          textFunc: (_, _key): string => {
            return products[_key].name;
          },
          isSetFunc: (): boolean => {
            return !!(selectedProduct && selectedProduct.name);
          },
          setParentMenuAfter: true,
        },
      },
    });

    this.menuTelegrafInline.addButton({
      buttonType: 'simpleButton',
      buttonProps: {
        text: 'Sincronizar',
        action: 'fsync',
        additionalArgs: {
          doFunc: async (_context): Promise<void> => {
            // console.log(`>> ENVIANDO DADOS >> ${JSON.stringify(selectedGroup,)} & >> & ${selectedProduct}`,);

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
          hide: (): boolean =>
            !(selectedProduct.name && selectedGroup.name) || hideSelects,
          setMenuAfter: false,
        },
      },
    });

    return this.menuTelegrafInline.init({
      actionCode: 'produto',
      backButtonText: 'Voltar',
      mainMenuButtonText: 'Voltar ao início',
    });
  }
}

export default UserProductMenu;
