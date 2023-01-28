import { Injectable } from '@angular/core';
import { EnvironmentModel } from '../models/environment.model';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    environment: EnvironmentModel | undefined;
    httpClient: HttpClient;
    constructor(private handlar: HttpBackend) {
        this.httpClient = new HttpClient(this.handlar);
    }

    loadEnvironment() {
        return this.httpClient
            .get<EnvironmentModel>('assets/config.json')
            .toPromise()
            .then(data => {
                this.environment = data;
            });
    }
}
