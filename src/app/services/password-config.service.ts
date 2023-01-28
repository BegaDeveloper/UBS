import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PasswordConfigModel } from '../models/password-config.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PasswordConfigService {
    constructor(private http: HttpClient) {}

    getPasswordConfig(): Observable<PasswordConfigModel> {
        return this.http.get<PasswordConfigModel>('ui/password-config');
    }
}
