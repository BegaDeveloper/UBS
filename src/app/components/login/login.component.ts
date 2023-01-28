import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from 'src/app/services/translate.service';
import { SessionService } from '../../services/session-service';
import { configurationToken, EnvironmentModel } from '../../models/environment.model';
import { AuthenticateResponse } from '../../models/user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    @ViewChild('authForm') form: NgForm;
    isFormSubmitted: boolean = false;
    isPasswordVisible: boolean = false;
    isTestingEnvironment: boolean;

    constructor(
        private authService: AuthService,
        private router: Router,
        private sessionService: SessionService,
        private translateService: TranslateService,
        @Inject(configurationToken) private configuration: EnvironmentModel,
    ) {}

    ngOnInit(): void {
        this.isTestingEnvironment = this.configuration.isTestEnvironment;
        this.sessionService.clearStorage();
    }

    onSubmit() {
        const email = this.form.value.email;
        const password = this.form.value.password;
        this.isFormSubmitted = true;
        if (this.form.valid) {
            this.authService.login(email, password).subscribe({
                next: (res: AuthenticateResponse) => {
                    this.sessionService.setAccessToken(res.accessToken);
                    this.sessionService.setRefreshToken(res.refreshToken);
                    this.sessionService.setAccessTokenValidUntil(res.accessTokenValidUntil);
                    this.sessionService.setRefreshTokenValidUntil(res.refreshTokenValidUntil);

                    this.authService.setIsLoggedIn(true);
                    this.router.navigate(['/main']);
                },
                error: error => {
                    error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
                },
            });
        } else {
            return;
        }
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.form?.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
}
