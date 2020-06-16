import TelegrafInlineMenu from 'telegraf-inline-menu/dist/source';
import { ContextNextFunc } from 'telegraf-inline-menu/dist/source/generic-types';
import { TelegrafContext } from 'telegraf/typings/context';
import { MenuOptions } from 'telegraf-inline-menu/dist/source/menu-options';
import { User, Chat } from 'telegraf/typings/telegram-types';

import AppError from '@shared/errors/AppError';

import IMenuTelegrafProvider from '../models/IMenuTelegrafProvider';
import IOptionsDTO from '../dtos/IOptionsDTO';
import IAddButtonsDTO from '../dtos/IAddButtonsDTO';
import IButtonPropsDTO from '../dtos/IButtonPropsDTO';
import IAddSelectDTO from '../dtos/IAddSelectDTO';

export default class MenuTelegrafProvider implements IMenuTelegrafProvider {
  private menu: TelegrafInlineMenu;

  public setOptions({ command, initializer }: IOptionsDTO): void {
    this.menu = new TelegrafInlineMenu(initializer);
    this.menu.setCommand(command);
  }

  public addQuestion({ text, action, additionalArgs }: IButtonPropsDTO): void {
    this.menu.question(text, action, additionalArgs);
  }

  public addButton({ buttonType, buttonProps }: IAddButtonsDTO): void {
    if (buttonType === 'simpleButton')
      this.menu.simpleButton(
        buttonProps.text,
        buttonProps.action,
        buttonProps.additionalArgs,
      );
  }

  public addSelect({ selectProps, submenuProps }: IAddSelectDTO): void {
    const { message, text } = submenuProps;

    const submenu = new TelegrafInlineMenu(message);

    this.menu.submenu(
      text,
      submenuProps.action,
      submenu,
      submenuProps.additionalArgs,
    );

    const { action, options, additionalArgs } = selectProps;

    submenu.select(action, options, additionalArgs);
  }

  public init(menuOptions: MenuOptions): ContextNextFunc {
    return this.menu.init(menuOptions);
  }

  public getFromUser(_context: TelegrafContext): User {
    if (_context.message) return _context.message.from;

    if (_context.update.message) return _context.update.message.from;

    if (_context.update.callback_query.message)
      return _context.update.callback_query.message.from;

    throw new AppError('Nothing found from user on this context');
  }

  public getChatInfo(_context: TelegrafContext): Chat {
    if (_context.message) return _context.message.chat;

    if (_context.update.message) return _context.update.message.chat;

    if (_context.update.callback_query.message)
      return _context.update.callback_query.message.chat;

    throw new AppError('Nothing found from chat on this context');
  }
}
