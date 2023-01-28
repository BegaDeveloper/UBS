import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SideMenu } from '../models/common.model';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SideMenuService {
    constructor(private http: HttpClient) {}

    //Get side menu items
    getMenuItems() {
        return this.http.get<SideMenu[]>('ui/menu-items').pipe(
            map(res => {
                return res;
            })
        );
    }
}
