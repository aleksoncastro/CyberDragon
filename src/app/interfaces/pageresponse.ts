export interface PageResponse<T> {
    page: number;
    pageSize: number;
    count: number;
    results: T[];
}

