import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { DashBoardList } from '../models/ref-status.model';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    constructor(private http: HttpClient) {}

    getDashboardItems() {
        return this.http.get<DashBoardList>('ui/dashboard').pipe(
            map(res => {
                return res;
            }),
        );
    }
}
