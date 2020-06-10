import { container } from 'tsyringe';

import IMonetizzeProvider from '../providers/MonetizzeProvider/models/IMonetizzeProvider';
import MonetizzeProvider from './MonetizzeProvider/implementations/MonetizzeProvider';

container.registerSingleton<IMonetizzeProvider>(
  'MonetizzeProvider',
  MonetizzeProvider,
);
