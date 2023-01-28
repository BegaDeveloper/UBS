import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import { map, Observable } from 'rxjs';
import { configurationToken, EnvironmentModel } from '../models/environment.model';
import { IUserDTO } from '../models/user.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class NavNotificationService {
    userId: number;
    constructor(
        @Inject(configurationToken) private configuration: EnvironmentModel,
        private userService: UserService,
        private authService: AuthService,
    ) {
        this.getRole();
    }

    getRole() {
        this.authService.isLoggedIn$.subscribe((res: any) => {
            if (res) {
                this.userService.getUserDetails().subscribe((res: IUserDTO) => {
                    this.userId = res.id;
                });
            }
        });
    }

    stomp = new RxStomp();
    stompConfig = new RxStompConfig();
    url = this.configuration.webSocketUrl;
    connect() {
        this.stompConfig.brokerURL = this.url;
        this.stompConfig.heartbeatIncoming = 15000;
        this.stompConfig.heartbeatOutgoing = 15000;
        this.stompConfig.reconnectDelay = 2000;
        this.stomp.configure(this.stompConfig);
        this.stomp.activate();
        return this.stomp.watch(`/user/${this.userId}/queue/updates`).pipe(
            map(message => {
                return message.body;
            }),
        );
    }
}
