import { container } from 'tsyringe';
import MenuTelegrafProvider from './implementations/MenuTelegrafProvider';
import IMenuTelegrafProvider from './models/IMenuTelegrafProvider';

container.registerInstance<IMenuTelegrafProvider>(
  'MenuTelegrafProvider',
  new MenuTelegrafProvider(),
);
