import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiInterceptor } from './services/api.interceptor';
import { ActivationComponent } from './components/activation/activation.component';
import { LogoutDialogComponent } from './modals/logout-dialog/logout-dialog.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NavComponent } from './components/nav/nav.component';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';
import { KeyLinkComponent } from './components/key-link/key-link.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { MainModule } from './modules/main/main.module';
import { DeleteDialogComponent } from './modals/delete-dialog/delete-dialog.component';
import { InformationDialog } from './modals/information-dialog/information-dialog';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ConfigurationService } from './services/configuration.service';
import { EnvironmentModel } from './models/environment.model';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';

export const config = (configService: ConfigurationService) => {
    return () => configService.loadEnvironment();
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ActivationComponent,
        LogoutDialogComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        KeyLinkComponent,
        NavComponent,
        DeleteDialogComponent,
        InformationDialog,
        ChangePasswordComponent,
    ],

    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MainModule,
        MaterialModule,
        SharedModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true,
        },
        {
            provide: EnvironmentModel,
            useExisting: ConfigurationService,
            deps: [HttpClient],
        },
        {
            provide: APP_INITIALIZER,
            deps: [ConfigurationService],
            multi: true,
            useFactory: config,
        },
        DatePipe,
    ],
    bootstrap: [AppComponent],
    exports: [ActivationComponent],
})
export class AppModule {}
