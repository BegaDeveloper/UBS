import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'src/app/services/translate.service';
import { UserService } from 'src/app/services/user.service';
import { ToggleSideBar } from '../../../../utils/toggle-side-bar';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    toggleSideBar: ToggleSideBar = new ToggleSideBar();
    constructor(private userService: UserService, private translateService: TranslateService) {}

    ngOnInit(): void {
        this.getUser();
    }

    status: boolean = false;

    getUser() {
        this.userService.getUserDetails().subscribe({
            next: res => {
                this.userService.setUserInfo(res);
            },
            error: error => {
                error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }
}
