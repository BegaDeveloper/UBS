import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry } from 'rxjs';
import { HolidayDTO, IHoliday } from '../models/holiday.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class HolidayService {
    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

    //Get serach holidays
    getSearchHolidays(search: string, pageNumber: number, pageSize: number, sortBy?: string, sortDirection?: string) {
        let paramsObject: { [k: string]: any } = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            search: search || '',
        };
        if (sortBy && sortDirection) {
            paramsObject['sortBy'] = sortBy;
            paramsObject['sortDirection'] = sortDirection;
        }
        let params = new HttpParams({ fromObject: paramsObject });

        return this.http.get<IHoliday>('holidays/search/', { params }).pipe(
            map(response => {
                return response;
            }),
        );
    }

    //Post holiday
    postHoliday(someData: any) {
        return this.http.post('holidays', someData).pipe(
            map(response => {
                return response;
            }),
        );
    }

    //Get holiday by id
    getHolidayId(id: number) {
        return this.http.get<HolidayDTO>('holidays/' + id).pipe(
            retry(1),
            catchError(this.errorHandler.handleError),
            map(response => {
                return response;
            }),
        );
    }

    //Edit holiday
    update(id: number, data: any) {
        return this.http.put<HolidayDTO>('holidays/' + id, data).pipe(
            map(response => {
                return response;
            }),
        );
    }

    deleteHoliday(id: number) {
        return this.http.delete('holidays/' + id).pipe(
            map(response => {
                return response;
            }),
        );
    }
}
