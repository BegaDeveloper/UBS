import { Component, OnInit } from '@angular/core';
import { SideMenu } from 'src/app/models/common.model';
import { SideMenuService } from 'src/app/services/side-menu.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
    //Tried placing SideMenu Interface as type below, but it wasnt working
    menuItems: SideMenu[];

    constructor(
        private sideMenuService: SideMenuService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.getSideMenu();
    }

    getSideMenu() {
        this.sideMenuService.getMenuItems().subscribe({
            next: res => {
                return (this.menuItems = res);
            },
            error: error => {
                error.appCode ?
                    this.translateService.showMessage(error.appCode) :
                    this.translateService.showMessage('SERVER_ERROR');
            }
        });
    }
}
