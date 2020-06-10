import { ObjectID } from 'mongodb';

export interface IDadosProduto {
  codigo: string | number;
  chave: string;
  nome: string;
}

export interface IDadosPostback {
  codigo?: string | number;
  descricao: string;
}

export interface IDadosVenda {
  codigo: string | number;
  plano?: string;
  dataInicio?: string | Date;
  dataFinalizada?: string | Date;
  meioPagamento?: string;
  formaPagamento?: string;
  garantiaRestante?: number | string;
  status?: string;
  valor?: string;
  quantidade?: string;
  valorRecebido?: string;
  tipo_frete?: string;
  onebuyclick?: string;
  venda_upsell?: string;
  frete?: string;
  cupom?: string;
  src?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_campaign?: string;
  linkBoleto?: string;
  linha_digitavel?: string;
}

export interface IDadosPlano {
  codigo?: string | number;
  referencia?: string;
  nome?: string;
  quantidade?: string;
  periodicidade?: string;
}

export interface IDadosAssinatura {
  codigo?: string | number;
  status?: string;
  data_assinatura?: string | Date;
  parcela?: string | number;
}

export interface IDadosComissao {
  nome?: string;
  tipo_comissao?: string;
  valor?: string | number;
  porcentagem?: string;
}

export interface IDadosComprador {
  nome?: string;
  email?: string;
  data_nascimento?: Date | string;
  cnpj_cpf?: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  numero?: string | number;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
}

export interface IDadosProdutor {
  cnpj_cpf?: string;
  nome?: string;
}

export interface IDados {
  id: ObjectID;
  chave_unica?: string;
  produto?: IDadosProduto;
  tipoPostback?: IDadosPostback;
  venda?: IDadosVenda;
  plano?: IDadosPlano;
  url_recuperacao?: string;
  assinatura?: IDadosAssinatura;
  comissoes?: Array<IDadosComissao>;
  comprador?: IDadosComprador;
  produtor?: IDadosProdutor;
  downloads?: string | number;
}

export default interface IMonetizzeResponse {
  status: number;
  dados: Array<IDados>;
  recordCount: string | number;
  pages: number | string;
  error: string;
}
