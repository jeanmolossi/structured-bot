import { ConstOrContextFunc } from 'telegraf-inline-menu/dist/source/generic-types';

export default interface IOptionsDTO {
  command: string;
  initializer: ConstOrContextFunc<string>;
}
