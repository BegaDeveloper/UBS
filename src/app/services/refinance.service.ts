import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { IPage } from '../models/common.model';
import { ILoanType } from '../models/loan-type.model';
import { DebtInfoRequestModel, IRefinance, RequestModel } from '../models/refinance.model';
import { RefStatusModel } from '../models/ref-status.model';
import { RefinanceReasonModel } from '../models/refinance-reason.model';

@Injectable({
    providedIn: 'root',
})
export class RefinanceService {
    constructor(private http: HttpClient) {}

    //Get loan types
    searchLoanTypes(search: string, pageNumber: number, pageSize: number) {
        let params = new HttpParams()
            .append('pageNumber', pageNumber)
            .append('pageSize', pageSize)
            .append('search', search || '');

        return this.http.get<IPage<ILoanType>>('loan-types/search/', { params }).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Create draft request
    createDraft(data: RequestModel) {
        return this.http.post<RequestModel>('ref-requests/create-draft', data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    createAndSubmit(data: RequestModel) {
        return this.http.post<RequestModel>('ref-requests/create-and-submit', data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    upload(file: File, type: string): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('document', file);

        let params = new HttpParams().append('type', type);

        const req = new HttpRequest('POST', 'documents/upload', formData, {
            params,
            reportProgress: true,
            responseType: 'json',
        });

        return this.http.request(req);
    }

    getRefinance(
        search: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        statuses: string[],
        debtorTypes: string[],
        newBank: boolean,
        prevBank: boolean,
        startDate: string,
        endDate: string,
    ) {
        let params = new HttpParams()
            .append('pageNumber', pageNumber)
            .append('pageSize', pageSize)
            .append('search', search || '')
            .append('newBank', newBank)
            .append('prevBank', prevBank);

        if (sortBy && sortDirection) {
            params = params.append('sortBy', sortBy);
            params = params.append('sortDirection', sortDirection);
        }

        if (startDate && endDate) {
            params = params.append('startDate', startDate);
            params = params.append('endDate', endDate);
        }

        statuses.forEach((res: string) => {
            params = params.append('statuses', res);
        });

        debtorTypes.forEach((res: string) => {
            params = params.append('debtorTypes', res);
        });

        return this.http.get<IRefinance>('ref-requests/search/', { params }).pipe(
            map(res => {
                return res;
            }),
        );
    }

    getStatuses() {
        return this.http.get<RefStatusModel[]>('ui/ref-status');
    }

    //Download documents
    getDocs(id: number) {
        const httpOptions = {
            responseType: 'blob' as 'json',
        };

        return this.http.get('documents/download/' + id, httpOptions).pipe(
            map(res => {
                return res;
            }),
        );
    }

    checkDebtorValidity(debtorId: string, debtorType: string): Observable<string | boolean> {
        let params = new HttpParams().append('customerId', debtorId).append('debtorType', debtorType);

        return this.http.get('ui/debtor-validate', { params }).pipe(
            map(() => {
                return true; // valid jmbg/mb
            }),
            catchError(error => {
                return of(error.appCode); // invalid jmbg/mb
            }),
        );
    }

    checkBankAccountValidity(bankAccount: string): Observable<string | boolean> {
        let params = new HttpParams().append('bankAccount', bankAccount);

        return this.http.get('ui/validate-bank-account', { params }).pipe(
            map(() => {
                return true; // valid bank account
            }),
            catchError(error => {
                return of(error.appCode); // invalid bank account
            }),
        );
    }

    checkReferenceNumberValidity(referenceNumber: string, paymentModel: string): Observable<string | boolean> {
        let params = new HttpParams().append('referenceNumber', referenceNumber).append('model', paymentModel);

        return this.http.get('ui/validate-reference-number', { params }).pipe(
            map(() => {
                return true; // valid payment reference number
            }),
            catchError(error => {
                return of(error.appCode); // invalid payment reference number
            }),
        );
    }

    getRequest(id: number) {
        return this.http.get<RequestModel>('ref-requests/' + id).pipe(
            map(request => {
                return request;
            }),
        );
    }

    sendDebtRequest(body: DebtInfoRequestModel, id: number) {
        return this.http.post<DebtInfoRequestModel>(`ref-requests/send-debt-info/${id}`, body).pipe(
            map(res => {
                return res;
            }),
        );
    }

    updateDraftRefloanRequest(data: RequestModel, id: number) {
        return this.http.post<RequestModel>(`ref-requests/save-draft/${id}`, data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    submitDraftRequest(data: RequestModel, id: number) {
        return this.http.post<RequestModel>(`ref-requests/submit/${id}`, data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    submitTrans(id: number) {
        return this.http.post(`ref-requests/submit-trans/${id}`, {}).pipe(
            map(res => {
                return res;
            }),
        );
    }

    updateTrans(id: number) {
        return this.http.post(`ref-requests/update-trans/${id}`, {}).pipe(
            map(res => {
                return res;
            }),
        );
    }

    confirmTransaction(id: number) {
        return this.http.post(`ref-requests/confirm-transaction/${id}`, {}).pipe(
            map(res => {
                return res;
            }),
        );
    }

    getHistory(id: number) {
        return this.http.get('ref-requests/history/' + id).pipe(
            map(res => {
                return res;
            }),
        );
    }

    getRequestReasons(reason: string) {
        return this.http.get<RefinanceReasonModel[]>(`ref-requests/reasons/${reason}`).pipe(
            map(res => {
                return res;
            }),
        );
    }

    sendRefinanceReason(id: number, body: any, url: string) {
        return this.http.post(`${url}/${id}`, body).pipe(
            map(res => {
                return res;
            }),
        );
    }

    downLoadDebtInfoDocument(id: number, index: number) {
        return this.http.get(`reports/debt-info-report/${id}/${index}`, { responseType: 'blob', observe: 'response' });
    }

    //Save dept info
    saveDept(id: number, data: any) {
        return this.http.post('ref-requests/save-debt-info/' + id, data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    getListOfActions(action: any) {
        return this.http.get('documents/get-document-types-for-action/' + action).pipe(
            map(res => {
                return res;
            }),
        );
    }
}
