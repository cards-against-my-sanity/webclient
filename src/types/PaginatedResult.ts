export default interface PaginatedResult<T> {
  page: number,
  itemsThisPage: number,
  totalPages: number,
  totalItems: number,
  firstPage: boolean,
  lastPage: boolean,
  items: T[]
}