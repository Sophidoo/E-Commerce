export interface Pagination {
  filterBy? : string;
  filterParam: object | number | string;
  sortDir? : string;
  sortBy?: string;
  pageNo? : number ;
  pageSize?: number;
}
