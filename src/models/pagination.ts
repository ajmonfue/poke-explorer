export interface Page<T> {
    count: number;
    currentPage: number;
    isLast: boolean;
    data: Array<T>
}