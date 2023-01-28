import { IPageable, ISort } from "./common.model";

export interface Holiday {
    startYear: number;
    endYear: number;
    month: number;
    day: number;
    name: string;
}

export class HolidayData implements Holiday {
    constructor(
        public startYear: number,
        public endYear: number,
        public month: number,
        public day: number,
        public name: string
    ) {}
}

export interface HolidayDTO {
    id: number;
    startYear: number;
    endYear: number;
    month: number;
    day: number;
    name: string;
}

export interface IHoliday {
    content: HolidayDTO[];
    pageable: IPageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: ISort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export class HolidayTableContent {
    content: HolidayTable[] = [];
    totalElements: number;
}

export class HolidayTable {
    id: number;
    name: string;
    endYear: string;
}

export class TransformContent {
    static transform(content: HolidayDTO) {
        const holidayTable = new HolidayTable();
        holidayTable.id = content.id;
        holidayTable.name = content.name;
        holidayTable.endYear = content.day + '.' + content.month + '.' + content.startYear + '/' + content.endYear;
        return holidayTable;
    }
}
