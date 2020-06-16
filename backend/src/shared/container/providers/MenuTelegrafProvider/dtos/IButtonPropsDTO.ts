import {
  ConstOrContextFunc,
  ContextFunc,
} from 'telegraf-inline-menu/dist/source/generic-types';
import { TelegrafContext } from 'telegraf/typings/context';

export default interface IButtonPropsDTO {
  text: ConstOrContextFunc<string>;
  action: string;
  additionalArgs?: {
    questionText: ConstOrContextFunc<string>;
    setFunc: (
      ctx: TelegrafContext,
      answer: string | undefined,
    ) => Promise<void> | void;
    uniqueIdentifier: string;
    hide?: ContextFunc<boolean>;
  };
}
