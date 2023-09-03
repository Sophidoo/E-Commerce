export interface Pagination {
    filterBy?: string;
    filterParam: string;
    filterKey: string;
    filterValue: string | number;
    sortDir?: string;
    sortBy?: string;
    pageNo?: number;
    pageSize?: number;
}
