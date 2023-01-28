import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PasswordConfigService } from '../services/password-config.service';
import { PasswordConfigModel } from '../models/password-config.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PasswordConfigResolver implements Resolve<any> {
    passwordConfig$: Observable<PasswordConfigModel>;
    passwordConfig: PasswordConfigModel;
    constructor(private passwordConfigService: PasswordConfigService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.passwordConfig$ = this.passwordConfigService.getPasswordConfig();
        return this.passwordConfig$;
    }
    getPasswordConfig() {
        return this.passwordConfig$.subscribe(data => (this.passwordConfig = data));
    }
}
