import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { LANG_SR_TRANS } from '../utils/sr-Latin';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    constructor() {}

    handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            //client side error
            errorMessage = `${LANG_SR_TRANS.SERVER_ERROR}`;
        } else {
            //server side error
            errorMessage = `${LANG_SR_TRANS.SERVER_ERROR}`;
        }

        return throwError(() => {
            return errorMessage;
        });
    }
}
