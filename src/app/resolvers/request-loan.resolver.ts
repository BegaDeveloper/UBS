import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { RequestModel } from '../models/refinance.model';
import { RefinanceService } from '../services/refinance.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RequestLoanResolver implements Resolve<any> {
    constructor(private refinanceService: RefinanceService) {}
    requestLoan: Observable<RequestModel>;
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        const id = Number(route.paramMap.get('id'));
        return (this.requestLoan = this.refinanceService.getRequest(id));
    }
}
