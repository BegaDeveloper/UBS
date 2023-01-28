import { Component, Inject } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { configurationToken, EnvironmentModel } from './models/environment.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'frontend-dev';
    url: string;
    constructor(@Inject(configurationToken) private configuration: EnvironmentModel) {
        this.url = configuration.baseUrl;
    }
}
