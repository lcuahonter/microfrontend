export interface TableData {
  headers: string[];
  body: string[][];
}

export interface TableDataConverted {
  headers: string[];
  body: TableBodyData[];
}

export interface TableBodyData<T = any> {
  rows: string[];
  isSelected: boolean;
  hiddenData?: T;
}

export interface PaginationInfo {
  page: number;
  totalPage: number;
  totalRecords: number;
  totalToLoad: number;
}
