export interface IQuery {
  page: string;
  limit: string;
  sortedBy: string;

  [key: string]: string;
}

export interface IPaginationResponse<T> {
  page: number;
  perPage: number;
  totalCount: number;
  itemsFound: number;
  entities: T[];
}
