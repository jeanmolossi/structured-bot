import {
  ContextFunc,
  ConstOrContextFunc,
  ContextKeyFunc,
  ContextKeyIndexArrFunc,
} from 'telegraf-inline-menu/dist/source/generic-types';
import { SelectOptions } from 'telegraf-inline-menu/dist/source/buttons/select';

interface ISelectAdditionalProps {
  setFunc: ContextKeyFunc<void>;
  textFunc?: ContextKeyIndexArrFunc<string>;
  isSetFunc?: ContextKeyFunc<boolean>;
  columns?: number;
  hide?: ContextKeyFunc<boolean>;
  setMenuAfter?: boolean;
  setParentMenuAfter?: boolean;
}

interface IButtonOptions {
  hide?: ContextFunc<boolean>;
  joinLastRow?: boolean;
}

interface ISubmenuProps {
  message: ConstOrContextFunc<string>;
  text: ConstOrContextFunc<string>;
  action: string;
  additionalArgs?: IButtonOptions;
}

export default interface IAddSelectDTO {
  submenuProps: ISubmenuProps;
  selectProps: {
    action: string;
    options: ConstOrContextFunc<SelectOptions>;
    additionalArgs: ISelectAdditionalProps;
  };
}
