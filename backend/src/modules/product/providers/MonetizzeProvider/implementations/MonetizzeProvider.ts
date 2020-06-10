import axios, { AxiosInstance } from 'axios';

import http_build_query from '@shared/utils/http_build_query';
import ITransactionPayloadDTO from '@modules/product/dtos/ITransactionPayloadDTO';
import AppError from '@shared/errors/AppError';
import IMonetizzeProvider from '../models/IMonetizzeProvider';
import IMonetizzeResponse from '../models/IMonetizzeResponse';

class MonetizzeProvider implements IMonetizzeProvider {
  private monetizzeApi: AxiosInstance;

  constructor() {
    this.monetizzeApi = axios.create({
      baseURL: 'https://api.monetizze.com.br/2.1',
    });
  }

  public async getToken(consumerKey: string): Promise<string> {
    this.monetizzeApi.defaults.headers.X_CONSUMER_KEY = consumerKey;
    const tokenRequest = await this.monetizzeApi.get(`token`);

    if (tokenRequest.status === 403)
      throw new AppError('Invalid crendentials, or not provided', 403);

    return tokenRequest.data.token;
  }

  public async getTransaction(
    consumerKey: string,
    payload: ITransactionPayloadDTO,
  ): Promise<IMonetizzeResponse> {
    const httpBuildQuery = http_build_query(payload);

    const token = await this.getToken(consumerKey);
    this.monetizzeApi.defaults.headers.TOKEN = token;
    const newRequest = await this.monetizzeApi.get<IMonetizzeResponse>(
      `transactions${httpBuildQuery}`,
    );

    if (newRequest.status === 403)
      throw new AppError('Invalid token provided', 403);

    const getTransactionResponse: IMonetizzeResponse = newRequest.data;

    return getTransactionResponse;
  }
}

export default MonetizzeProvider;
