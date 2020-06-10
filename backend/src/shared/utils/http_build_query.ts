import ITransactionPayloadDTO from '@modules/product/dtos/ITransactionPayloadDTO';

export default (payload: ITransactionPayloadDTO): string => {
  const arrayFrom = Object.keys(payload);

  const buildQueryArray = arrayFrom.map(key => `${key}=${payload[key]}`);
  const buildQueryString = `?${buildQueryArray.join('&')}`;

  return buildQueryString;
};
