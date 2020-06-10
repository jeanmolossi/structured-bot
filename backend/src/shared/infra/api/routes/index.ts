import { IncomingMessage } from 'telegraf/typings/telegram-types';
import { TelegrafContext } from 'telegraf/typings/context';

interface IRequest {
  routes: string;
  callback: Function;
  params: {
    context?: TelegrafContext;
    incomingMessage: IncomingMessage;
    [key: string]: any;
  };
}

const inRoute = async ({
  routes,
  callback,
  params: args,
}: IRequest): Promise<any> => {
  const [res] = await routes.split(' ').map(async route => {
    const paramObject = { ...args };
    const { incomingMessage } = paramObject;

    if (route in incomingMessage) {
      let cbAnswer;
      try {
        cbAnswer = await callback(paramObject);
      } catch (error) {
        console.log(JSON.stringify(error), ' >> TELEGRAG API ROUTE ');
        cbAnswer = { message: `Error ocurred in route > ${route} >> catch` };
      }
      // eslint-disable-next-line no-console
      console.log(cbAnswer, '>> Retorno do CB in //', route);

      return cbAnswer;
    }
    return { message: `Error ocurred in route > ${route}` };
  });
  return res;
};

export default inRoute;
