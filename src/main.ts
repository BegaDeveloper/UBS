import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { configurationToken } from './app/models/environment.model';

let configurationPath = 'assets/config.json';
fetch(configurationPath)
    .then(response => response.json())
    .then(configuration => {
        if (configuration.production) {
            enableProdMode();
        }

        return platformBrowserDynamic([{ provide: configurationToken, useValue: configuration }]).bootstrapModule(AppModule);
    })
    .catch(error => console.error(error));
