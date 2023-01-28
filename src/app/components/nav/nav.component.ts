import { Component, Inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../../modals/logout-dialog/logout-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { configurationToken, EnvironmentModel } from '../../models/environment.model';
import { ToggleSideBar } from '../../utils/toggle-side-bar';
import { IUserDTO, RoleDto } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { NavNotificationService } from 'src/app/services/nav-notification.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { SubscriptionNotificationDTO } from 'src/app/models/subs.model';
import { TranslateService } from 'src/app/services/translate.service';
import { SessionService } from 'src/app/services/session-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
    userInfo$ = this.userService.userInfo$;
    isTestingEnvironment: boolean;
    role: any[];
    currentUser: IUserDTO;
    notificationSubscription: Subscription;
    notificationAlert: SubscriptionNotificationDTO;
    messagesNot: any;
    reqId: number;
    reqBody: any;
    mainBodyConnect: any;
    constructor(
        private dialog: MatDialog,
        private router: Router,
        private userService: UserService,
        private navNotification: NavNotificationService,
        private subsService: SubscriptionsService,
        private activatedRoute: ActivatedRoute,
        private translateService: TranslateService,
        private authService: AuthService,

        private sessionService: SessionService,
        @Inject(configurationToken) private configuration: EnvironmentModel,
    ) {}

    ngOnInit(): void {
        this.authService.isLoggedIn$.subscribe(res => {
            if (res) {
                this.isTestingEnvironment = this.configuration.isTestEnvironment;
                this.userInfo$.subscribe();
                this.userInfo$.subscribe(res => {
                    this.role = res?.roles;
                });
                this.getNotificationItems();
                this.userService.getUserDetails().subscribe({
                    next: res => {
                        this.currentUser = res;
                        if (
                            this.currentUser &&
                            this.currentUser.roles &&
                            (this.currentUser.roles.includes(RoleDto.OPERATOR_NEW) ||
                                this.currentUser.roles.includes(RoleDto.OPERATOR_PREV))
                        ) {
                            if (!this.notificationSubscription) {
                                this.notificationSubscription = this.navNotification.connect().subscribe((res: any) => {
                                    const navList = JSON.parse(res);
                                    this.getNotificationItems(navList);
                                });
                            }
                        }
                    },
                });
            }
        });
    }

    getNotificationItems(notificationItems?: any) {
        this.subsService.getNotification().subscribe({
            next: (res: any) => {
                if (notificationItems) {
                    this.mainBodyConnect = notificationItems?.unreadCount;
                    this.reqBody = res.notifications.content;
                } else {
                    this.mainBodyConnect = res.unreadCount;
                    this.reqBody = res.notifications?.content;
                    setTimeout(() => {
                        this.mainBodyConnect = 0;
                        this.subsService.readNotifications().subscribe((res: any) => {});
                    }, 300);
                }
            },
            error: (error: any) => {
                error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    toggleSideBar() {
        ToggleSideBar.toggle();
    }
    openDialog() {
        this.dialog.open(LogoutDialogComponent);
    }

    goToDashboard() {
        this.router.navigate(['/main/dashboard']);
    }

    ngOnDestroy(): void {
        if (this.notificationSubscription) {
            this.notificationSubscription.unsubscribe();
        }
    }
}
