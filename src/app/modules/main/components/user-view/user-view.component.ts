import { Component, OnInit, ViewChild } from '@angular/core';
import { IPage } from 'src/app/models/common.model';
import { IUserDTO } from 'src/app/models/user.model';
import { UserService } from '../../../../services/user.service';
import { AdministrationBanksStateService } from '../../../../services/administration-banks-state.service';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../../../modals/delete-dialog/delete-dialog.component';
import { Components } from '../../../../utils/enums';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-user-view',
    templateUrl: './user-view.component.html',
    styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
    users: IUserDTO[];
    pageSize: number = 10;
    totalElements: number;
    search: string;
    pageIndex: number;
    isEdit: boolean;
    sortBy: string = '';
    sortDirection: string = '';
    isEditOrAddNewMode: boolean;
    rows = ['id', 'login', 'firstName', 'lastName', 'active', 'enabled', 'action'];
    column: IPage<IUserDTO>;
    columnsClasses: string[] = ['col-width10', 'col-width20', '', '', '', '', 'col-action'];
    page = Components.USER;

    constructor(
        private userService: UserService,
        private stateService: AdministrationBanksStateService,
        private router: Router,
        private dialog: MatDialog,
    ) {
        this.router.getCurrentNavigation()?.extras.state;
        this.isEditOrAddNewMode = history.state?.editOrAddNewMode;
    }

    ngOnInit() {
        this.isEditOrAddUser();
        this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
    }

    getSearch(search: any, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string) {
        this.userService.getSearchUser(search, pageNumber, pageSize, sortBy, sortDirection).subscribe((res: IPage<IUserDTO>) => {
            this.totalElements = res.totalElements;
            this.column = res;
            this.column.content.forEach((item: any) => {
                item.active = item.active ? 'Da' : 'Ne';
            });

            this.column.content.forEach((item: any) => {
                item.enabled = item.enabled ? 'Da' : 'Ne';
            });
        });
    }

    getServerData(index: any) {
        this.getSearch(this.search, index, this.pageSize, this.sortBy, this.sortDirection);
    }

    setSearch(event: any) {
        this.search = event.target.value;
        this.pageIndex = 0;
        this.stateService.setSearchFieldValue(this.search);
        this.stateService.setPaginatorIndex(this.pageIndex);
        this.stateService.setSortDirection(this.sortDirection);
        this.stateService.setSortBy(this.sortBy);
        this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
    }

    isEditOrAddUser() {
        if (this.isEditOrAddNewMode) {
            this.pageIndex = this.stateService.getPaginatorIndex();
            this.search = this.stateService.getSearchFieldValue();
            this.sortBy = this.stateService.getSortBy();
            this.sortDirection = this.stateService.getSortDirection();
        } else {
            this.pageIndex = 0;
            this.search = '';
            this.stateService.setSearchFieldValue(this.search);
            this.stateService.setPaginatorIndex(this.pageIndex);
            this.stateService.setSortBy(this.sortBy);
            this.stateService.setSortDirection(this.sortDirection);
        }
    }

    toggleSortOptions() {
        this.sortBy = this.stateService.getSortBy();
        this.sortDirection = this.stateService.getSortDirection();
        this.pageIndex = this.stateService.getPaginatorIndex();
        this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
    }

    openDeleteDialog(id: number) {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '300px',
            height: 'auto',
            data: { component: Components.USER, id: id },
            position: { top: '20%', left: '42%' },
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res.event) {
                this.pageIndex = this.stateService.getPaginatorIndex();
                this.search = this.stateService.getSearchFieldValue();
                this.sortBy = this.stateService.getSortBy();
                this.sortDirection = this.stateService.getSortDirection();
                this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
            }
        });
    }
}
