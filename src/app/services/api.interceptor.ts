import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { SessionService } from './session-service';
import { configurationToken, EnvironmentModel } from '../models/environment.model';
import { AuthenticateResponse } from '../models/user.model';
import { AuthService } from './auth.service';
import { TranslateService } from './translate.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private authService: AuthService,
        private sessionService: SessionService,
        private translateService: TranslateService,
        @Inject(configurationToken) private configuration: EnvironmentModel
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.sessionService.getAccessToken();
        const apiReq = req.clone({ url: `${this.configuration.baseUrl}/${req.url}` });
        if (accessToken) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
                url: `${this.configuration.baseUrl}/${req.url}`,
            });
            return next.handle(cloned).pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        return this.handle401Error(cloned, next);
                    } else {
                        return throwError(() => err.error);
                    }
                }),
            );
        } else {
            return next.handle(apiReq).pipe(
                catchError((err: HttpErrorResponse) => {
                    return throwError(() => err.error);
                }),
            );
        }
    }

    private addToken(request: HttpRequest<any>, accessToken: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject$.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((res: AuthenticateResponse) => {
                    this.isRefreshing = false;
                    this.sessionService.setAccessToken(res.accessToken);
                    this.sessionService.setAccessTokenValidUntil(res.accessTokenValidUntil);
                    this.sessionService.setRefreshToken(res.refreshToken);
                    this.sessionService.setRefreshTokenValidUntil(res.refreshTokenValidUntil);
                    this.refreshTokenSubject$.next(res.accessToken);
                    return next.handle(this.addToken(request, res.accessToken));
                }),
                catchError(() => {
                    this.isRefreshing = false;
                    this.translateService.showMessage('token_expired');
                    this.authService.logout();
                    return EMPTY;
                }),
            );
        } else {
            return this.refreshTokenSubject$.pipe(
                filter((token) => token != null),
                take(1),
                switchMap((accessToken) => {
                    return next.handle(this.addToken(request, accessToken));
                }),
                catchError(() => {
                    this.isRefreshing = false;
                    this.translateService.showMessage('token_expired');
                    this.authService.logout();
                    return EMPTY;
                }),
            );
        }
    }
}
