import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { BanksService } from '../services/banks.service';

@Injectable({
  providedIn: 'root',
})
export class BanksResolver implements Resolve<boolean> {
  constructor(private banksService: BanksService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.banksService.getBankId(+route.params['id']);
  }
}
