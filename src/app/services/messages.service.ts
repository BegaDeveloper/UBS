import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry } from 'rxjs';
import { ActionsData, MessageTemplateDTO } from '../models/messages.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

    // #1 Search messages
    getSearch(search: string, pageNumber: number, pageSize: number, sortBy?: string, sortDirection?: string) {
        let paramsObject: { [k: string]: any } = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            search: search || '',
        };
        if (sortBy !== '' && sortDirection !== '') {
            paramsObject['sortBy'] = sortBy;
            paramsObject['sortDirection'] = sortDirection;
        }

        let params = new HttpParams({ fromObject: paramsObject });

        return this.http.get('message-templates/search/', { params }).pipe(
            map(res => {
                return res;
            }),
        );
    }

    // #2 Post message
    postMesssageTemplate(data: any) {
        return this.http.post<any>('message-templates', data).pipe(
            map(response => {
                return response;
            }),
        );
    }

    // #3 Edit message
    editMessageTemplate(data: any, id: number) {
        return this.http.put<MessageTemplateDTO>('message-templates/' + id, data).pipe(
            map(response => {
                return response;
            }),
        );
    }

    // #4 Get message by id
    getMessageTemplateId(id: number) {
        return this.http.get<MessageTemplateDTO>('message-templates/' + id).pipe(
            retry(1),
            catchError(this.errorHandler.handleError),
            map(response => {
                return response;
            }),
        );
    }

    // #5 Delete message template
    deleteMessageTemplate(id: number) {
        return this.http.delete('message-templates/' + id).pipe(
            map(response => {
                return response;
            }),
        );
    }

    // #6 Get actions
    getActions() {
        return this.http.get<ActionsData>('message-templates/actions/').pipe(
            map(res => {
                return res;
            }),
        );
    }
}
