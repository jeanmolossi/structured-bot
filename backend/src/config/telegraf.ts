import Telegraf from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

interface Test{
  appState: string;
}


const config = {

}


if( !process.env.BOT_TOKEN )
throw new Error('You must provide a token bot');

const bot = new Telegraf( process.env.BOT_TOKEN, config );


export default bot;
