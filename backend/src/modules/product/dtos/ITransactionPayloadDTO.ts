export default interface ITransactionPayloadDTO {
  email?: string;
  product?: number | string;
  transaction?: number;
  status?: 1 | 2 | 3 | 4 | 5 | 6;
  date_min?: Date | string | number;
  date_max?: Date | string | number;
  end_date_min?: Date | string | number;
  end_date_max?: Date | string | number;
}
