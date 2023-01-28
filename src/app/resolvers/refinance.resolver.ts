import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RefinanceService } from '../services/refinance.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RefStatusModel } from '../models/ref-status.model';

@Injectable({
    providedIn: 'root',
})
export class RefinanceResolver implements Resolve<any> {
    statuses$: Observable<RefStatusModel[]>;

    constructor(private refinanceService: RefinanceService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        this.statuses$ = this.refinanceService.getStatuses();
        return this.statuses$;
    }
}
