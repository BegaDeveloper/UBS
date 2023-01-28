import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common'

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    constructor(public datePipe: DatePipe) {}

    public get storage(): Storage {
        return sessionStorage;
    }

    setAccessToken(accessToken: string): void {
        this.storage.setItem('accessToken', accessToken);
    }

    getAccessToken(): string | null {
        return this.storage.getItem('accessToken');
    }

    setRefreshToken(refreshToken: string): void {
        this.storage.setItem('refreshToken', refreshToken);
    }

    getRefreshToken(): string | null {
        return this.storage.getItem('refreshToken');
    }

    setAccessTokenValidUntil(accessTokenValidUntil: Date): void {
        this.storage.setItem('accessTokenValidUntil', JSON.stringify(accessTokenValidUntil));
    }

    getAccessTokenValidUntil(): Date | null {
        return JSON.parse(this.storage.getItem('accessTokenValidUntil') || '');
    }

    setRefreshTokenValidUntil(refreshTokenValidUntil: Date): void {
        this.storage.setItem('refreshTokenValidUntil', JSON.stringify(refreshTokenValidUntil));
    }

    getRefreshTokenValidUntil(): Date | null {
        return JSON.parse(this.storage.getItem('refreshTokenValidUntil') || '');
    }

    clearStorage() {
        this.storage.clear();
    }
}
