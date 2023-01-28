import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RootObject, SubscriptionNotificationDTO } from '../models/subs.model';

@Injectable({
    providedIn: 'root',
})
export class SubscriptionsService {
    constructor(private http: HttpClient) {}

    //GET
    getSubs() {
        return this.http.get<RootObject>('subscriptions').pipe(
            map(res => {
                return res;
            }),
        );
    }

    //PUT
    updateSubs(data: any) {
        return this.http.put('subscriptions', data).pipe(
            map(res => {
                return res;
            }),
        );
    }

    //GET NOTIFICATIONS
    getNotification() {
        return this.http.get<SubscriptionNotificationDTO>('subscriptions/notifications').pipe(
            map(res => {
                return res;
            }),
        );
    }

    //PUT READ
    readNotifications() {
        return this.http.post('subscriptions/mark-all-as-read', null).pipe(
            map(res => {
                return res;
            }),
        );
    }
}
