import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry } from 'rxjs';
import { IPage } from '../models/common.model';
import { ILoanType } from '../models/loan-type.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class LoanTypeService {
    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

    //Get serach Loan-Types
    searchLoanTypes(search: string, pageNumber: number, pageSize: number, sortBy?: string, sortDirection?: string) {
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

        return this.http.get<IPage<ILoanType>>('loan-types/search/', { params }).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Get Loan by id
    getLoanById(id: number) {
        return this.http.get<ILoanType>('loan-types/' + id).pipe(
            retry(1),
            catchError(this.errorHandler.handleError),
            map(res => {
                return res;
            }),
        );
    }

    //PUT Update Loan
    updateLoan(data: ILoanType, id: number) {
        return this.http.put<ILoanType>('loan-types/' + id, data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Post new Loan
    postNewLoan(data: any) {
        return this.http.post<ILoanType>('loan-types', data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Delete Loan
    deleteLoan(id: number) {
        return this.http.delete('loan-types/' + id).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Get all loans
    getAllLoans() {
        return this.http.get('loan-types').pipe(
            map(res => {
                return res;
            }),
        );
    }
}
