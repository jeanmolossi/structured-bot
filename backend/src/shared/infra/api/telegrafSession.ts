import { User } from "telegraf/typings/telegram-types";

interface State{
  fromUser?: User;
  userEmail?: string;
}


class TelegrafFakeSession {
  private state: State;

  constructor(){

    this.state = {};

    return this;
  }

  newState(data: State) {
    Object.assign( this.state, data );
    return this.state;
  }

  getState(){
    return this.state;
  }
}

export default new TelegrafFakeSession();
