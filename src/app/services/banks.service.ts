import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError, debounceTime, debounce, timer, retry } from 'rxjs';
import { IBankData, IBankDTO } from '../models/bank.model';
import { IPage } from '../models/common.model';
import { Location } from '@angular/common';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class BanksService {
    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

    getSearch(search: string, pageNumber: number, pageSize: number, sortBy?: string, sortDirection?: string) {
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

        return this.http.get<IPage<IBankDTO>>('banks/search/', { params }).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //PUT
    updateBank(data: IBankData, id: number) {
        return this.http.put<IBankDTO>('banks/' + id, data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //GET
    getBankId(id: number) {
        return this.http.get<IBankDTO>('banks/' + id).pipe(
            retry(1),
            catchError(this.errorHandler.handleError),
            map(res => {
                return res;
            }),
        );
    }

    //POST
    postBank(data: IBankData) {
        return this.http.post<IBankDTO>('banks', data).pipe(
            map((res: IBankDTO) => {
                return res;
            }),
        );
    }

    //DELETE
    deleteBank(id: number) {
        return this.http.delete('banks/' + id).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //GET all banks
    getAllBanks() {
        return this.http.get('banks').pipe(
            map(response => {
                return response;
            }),
        );
    }
}
