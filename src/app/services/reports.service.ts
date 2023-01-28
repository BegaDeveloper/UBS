import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportsService {
    constructor(private http: HttpClient) {}

    downloadReport(startDate: string, endDate: string, reportType: string) {
        let paramsObject: { [k: string]: string } = {
            startDate: startDate,
            endDate: endDate,
        };
        let params = new HttpParams({ fromObject: paramsObject });

        let url = '';
        if (reportType === '1') {
            url = 'reports/late-report';
        } else if (reportType === '2') {
            url = 'reports/late-internal-report';
        } else if (reportType === '3') {
            url = 'reports/analytical-report-new-bank';
        } else if (reportType === '4') {
            url = 'reports/analytical-report-prev-bank';
        }

        return this.http.get(url, { params, responseType: 'blob', observe: 'response' }).pipe(
            catchError(this.parseErrorBlob),
            map(response => {
                return response;
            }),
        );
    }

    parseErrorBlob(err: any): Observable<any> {
        const reader: FileReader = new FileReader();

        const obs = Observable.create((observer: any) => {
            reader.onloadend = () => {
                observer.error(JSON.parse(reader.result as string));
                observer.complete();
            };
        });

        reader.readAsText(err);
        obs.subscribe(() => {});
        return obs;
    }
}
