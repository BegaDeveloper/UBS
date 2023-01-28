import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from 'src/app/modals/delete-dialog/delete-dialog.component';
import { ApplicationDTO } from 'src/app/models/applications.model';
import { IPage } from 'src/app/models/common.model';
import { AdministrationBanksStateService } from 'src/app/services/administration-banks-state.service';
import { ApplicationService } from 'src/app/services/application.service';
import { Components } from 'src/app/utils/enums';

@Component({
    selector: 'app-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit {
    items: ApplicationDTO[];
    pageSize: number = 10;
    totalElements: number;
    search: string;
    pageIndex: number;
    sortBy: string = '';
    sortDirection: string = '';
    isEditOrAddNewMode: boolean;
    bankName: string;
    rows = ['id', 'name', 'apiKey', 'action'];
    column: IPage<ApplicationDTO>;
    columnsClasses: string[] = ['col-width15', '', '', 'col-action'];
    page = Components.APPLICATIONS;

    constructor(
        private stateService: AdministrationBanksStateService,
        private router: Router,
        private dialog: MatDialog,
        private appService: ApplicationService,
    ) {
        this.router.getCurrentNavigation()?.extras.state;
        this.isEditOrAddNewMode = history.state?.editOrAddNewMode;
    }

    ngOnInit(): void {
        this.isEditOrAddNewBank();
        this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
    }

    getSearch(search: any, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string) {
        this.appService.getSearch(search, pageNumber, pageSize, sortBy, sortDirection).subscribe(res => {
            this.column = res;
            this.column.content.forEach((bank: any) => {
                this.bankName = bank.bank.name;
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
        this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
    }

    isEditOrAddNewBank() {
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
            data: { component: Components.APPLICATIONS, id: id },
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
