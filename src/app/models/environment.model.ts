import { InjectionToken } from '@angular/core';

export class EnvironmentModel {
    production: boolean;
    baseUrl: string;
    webSocketUrl: string;
    isTestEnvironment: boolean;
}
export const configurationToken = new InjectionToken('EnvironmentModel');
