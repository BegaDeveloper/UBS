import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardItem, DashBoardList } from 'src/app/models/ref-status.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TranslateService } from 'src/app/services/translate.service';
import { UserService } from 'src/app/services/user.service';
import { IUserDTO, RoleDto } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    currentUser: IUserDTO;
    dashboardItems: DashboardItem[];
    newBankRefActions: DashboardItem[];
    newBankRefPending: DashboardItem[];
    previousBankRefActions: DashboardItem[];
    previousBankRefPending: DashboardItem[];
    notificationSubscription: Subscription;
    constructor(
        private dashboardService: DashboardService,
        private userService: UserService,
        private translateService: TranslateService,
        private router: Router,
        private notificationService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.userService.getUserDetails().subscribe({
            next: res => {
                this.currentUser = res;
                if (this.currentUser && this.currentUser.roles && (this.currentUser.roles.includes(RoleDto.OPERATOR_NEW) || this.currentUser.roles.includes(RoleDto.OPERATOR_PREV))) {
                    this.getDashboardItems();
                    this.notificationSubscription = this.notificationService.connect(this.currentUser.bank.code).subscribe((res: any) => {
                        const dashboardList = JSON.parse(res);
                        this.getDashboardItems(dashboardList);
                    });
                }
            },
        });
    }

    getDashboardItems(dashBoardItems?: DashBoardList) {
        this.dashboardService.getDashboardItems().subscribe({
            next: res => {
                if (dashBoardItems) {
                    this.dashboardItems = dashBoardItems.dashboardDataList;
                } else {
                    this.dashboardItems = res.dashboardDataList;
                }
                this.newBankRefActions = this.dashboardItems.filter(
                    item => item.bankSide === 'NEW' && item.refStatus.code !== 'DEBT_INFO_PENDING',
                );
                this.newBankRefPending = this.dashboardItems.filter(
                    item => item.bankSide === 'NEW' && item.refStatus.code === 'DEBT_INFO_PENDING',
                );
                this.previousBankRefActions = this.dashboardItems.filter(
                    item => item.bankSide === 'PREVIOUS' && item.refStatus.code !== 'DEBT_INFO_PENDING',
                );
                this.previousBankRefPending = this.dashboardItems.filter(
                    item => item.bankSide === 'PREVIOUS' && item.refStatus.code === 'DEBT_INFO_PENDING',
                );
            },
            error: error => {
                error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    onCardClick(item: any) {
        this.router.navigate(['refinance-table'], { state: item });
    }

    ngOnDestroy(): void {
        if (this.notificationSubscription) {
            this.notificationSubscription.unsubscribe();
        }
    }
}
