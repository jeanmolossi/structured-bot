import { User } from 'telegraf/typings/telegram-types';
import { subMinutes } from 'date-fns';
import { ObjectID } from 'mongodb';

import IUserModel from '@modules/user/entities/IUserModel';

interface IState {
  fromUser?: User;
  userEmail?: string;
  userPhone?: string;
  userCpf?: string;
  userTgId?: string;
  dbUser?: IUserModel;
  adminApiConfig?: string;
  timeoutState?: Date | number;
  canceledExclusion?: boolean;
  interactingGroupExists?: boolean;
  productInGroup?: ObjectID | boolean;
}

class TelegrafFakeSession {
  private state: IState[];

  private timeoutState: Date | number;

  constructor() {
    this.state = [];
    this.timeoutState = null;

    return this;
  }

  public newState(data: IState, tgId: number | string): IState {
    Object.assign(this.state[`user-${tgId}`], data);
    return this.state[`user-${tgId}`];
  }

  public getState(tgId: number | string): IState {
    this.clearMemo.call(this);

    if (!this.state[`user-${tgId}`]) this.state[`user-${tgId}`] = {};

    return this.state[`user-${tgId}`];
  }

  public clearMemo(): void {
    const now = new Date().getTime();
    if (!this.timeoutState) this.timeoutState = now;

    const timeToClear = new Date(subMinutes(now, 15)).getTime();

    if (timeToClear >= this.timeoutState) {
      this.state = [];
      this.timeoutState = null;
    }
  }
}

export default new TelegrafFakeSession();
