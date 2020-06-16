import { MenuOptions } from 'telegraf-inline-menu/dist/source/menu-options';
import { ContextNextFunc } from 'telegraf-inline-menu/dist/source/generic-types';
import { TelegrafContext } from 'telegraf/typings/context';
import { User, Chat } from 'telegraf/typings/telegram-types';
import IOptionsDTO from '../dtos/IOptionsDTO';
import IAddButtonsDTO from '../dtos/IAddButtonsDTO';
import IButtonPropsDTO from '../dtos/IButtonPropsDTO';
import IAddSelectDTO from '../dtos/IAddSelectDTO';

export default interface IMenuTelegrafProvider {
  setOptions(options: IOptionsDTO): void;
  init(menuOptions: MenuOptions): ContextNextFunc;
  addButton(buttonConfig: IAddButtonsDTO): void;
  addSelect(selectConfig: IAddSelectDTO): void;
  addQuestion(buttonConfig: IButtonPropsDTO): void;
  getFromUser(context: TelegrafContext): User;
  getChatInfo(context: TelegrafContext): Chat;
}
