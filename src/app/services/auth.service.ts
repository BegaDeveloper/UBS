import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticateResponse } from '../models/user.model';
import { SessionService } from './session-service';
import { UserService } from './user.service';
import { AdministrationBanksStateService } from './administration-banks-state.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    user = new BehaviorSubject<AuthenticateResponse>(null!);
    isLoggedIn: BehaviorSubject<any> = new BehaviorSubject(this.sessionService.getAccessToken() ? true : false);
    isLoggedIn$ = this.isLoggedIn.asObservable();
    private authenticate: string = 'authenticate';

    constructor(
        private http: HttpClient,
        private router: Router,
        private sessionService: SessionService,
        private userService: UserService,
        private administrationBanksStateService: AdministrationBanksStateService,
    ) {}

    setIsLoggedIn(isLogged: boolean) {
        this.isLoggedIn.next(isLogged);
    }

    getIsLoggedIn() {
        return this.isLoggedIn.getValue();
    }
    // Login method
    login(email: string, password: string) {
        return this.http
            .post<AuthenticateResponse>(this.authenticate, {
                username: email,
                password: password,
                grantType: 'ACCESS',
            })
            .pipe(
                tap(resData => {
                    this.handleAuth(resData);
                }),
            );
    }

    // Refresh token method
    refreshToken() {
        return this.http
            .post<AuthenticateResponse>(this.authenticate, {
                grantType: 'REFRESH',
                refreshToken: this.sessionService.getRefreshToken(),
            })
            .pipe(
                tap(resData => {
                    this.handleAuth(resData);
                }),
            );
    }

    // Logging Out
    logout() {
        this.sessionService.clearStorage();
        this.user.next(null!);
        this.userService.deleteUserInfo();
        this.administrationBanksStateService.resetValuesToDefault();
        this.router.navigate(['/login']);
    }

    // Auth method
    private handleAuth(authenticateResponse: AuthenticateResponse) {
        const response = new AuthenticateResponse(
            authenticateResponse.accessToken,
            authenticateResponse.refreshToken,
            authenticateResponse.accessTokenValidUntil,
            authenticateResponse.refreshTokenValidUntil,
        );
        this.user.next(response);
    }
}
