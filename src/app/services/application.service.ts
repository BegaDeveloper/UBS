import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { IPage } from '../models/common.model';
import { ApplicationDTO } from '../models/applications.model';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApplicationService {
    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

    //Search applications
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

        return this.http.get<IPage<ApplicationDTO>>('applications/search/', { params }).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Post application
    postApp(data: any) {
        return this.http.post<ApplicationDTO>('applications', data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Update application
    updateApp(id: number, data: any) {
        return this.http.put<ApplicationDTO>('applications/' + id, data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Delete application
    deleteApp(id: number) {
        return this.http.delete('applications/' + id).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //Get app by id
    getAppById(id: number) {
        return this.http.get('applications/' + id).pipe(
            map(res => {
                return res;
            }),
        );
    }
}
