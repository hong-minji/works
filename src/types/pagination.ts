interface Pagination {
  currentPage: number;
  prevPagePath: string;
  nextPagePath: string;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export { type Pagination };
