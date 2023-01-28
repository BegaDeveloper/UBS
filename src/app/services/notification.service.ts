import { Inject, Injectable } from '@angular/core';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { configurationToken, EnvironmentModel } from '../models/environment.model';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(@Inject(configurationToken) private configuration: EnvironmentModel) {}
    stomp = new RxStomp();
    stompConfig = new RxStompConfig();
    url = this.configuration.webSocketUrl;
    connect(code: string) {
        this.stompConfig.brokerURL = this.url;
        this.stompConfig.heartbeatIncoming = 15000;
        this.stompConfig.heartbeatOutgoing = 15000;
        this.stompConfig.reconnectDelay = 2000;
        this.stomp.configure(this.stompConfig);
        this.stomp.activate();
        return this.stomp.watch('/dashboard/' + code).pipe(
            map(message => {
                return message.body;
            }),
        );
    }
}
