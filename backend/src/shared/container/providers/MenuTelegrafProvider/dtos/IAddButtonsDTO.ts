import {
  ContextFunc,
  ConstOrContextFunc,
} from 'telegraf-inline-menu/dist/source/generic-types';

interface ISimpleButtonProps {
  doFunc: ContextFunc<any>;
  setMenuAfter?: boolean;
  setParentMenuAfter?: boolean;
  hide?: ContextFunc<boolean>;
}

export default interface IAddButtonsDTO {
  buttonType: 'simpleButton';
  buttonProps: {
    text: ConstOrContextFunc<string>;
    action: string;
    additionalArgs: ISimpleButtonProps;
  };
}
