export interface ISort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface IPageable {
    offset: number;
    sort: ISort;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface IPage<T> {
    totalPages: number;
    totalElements: number;
    size: number;
    content: T[];
    number: number;
    sort: ISort;
    pageable: IPageable;
    last: boolean;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface IError {
    timestamp: Date;
    errorCode: string;
    appCode: string;
    //appParams: AppParams;
    errorMessages: string[];
}

export interface SideMenu {
    name: string;
    path: string;
    imageClass: string;
}

