export interface ResponseApi<T> {
  items: T[];
  totalNumberOfItems: number;
  numberOfPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
}
