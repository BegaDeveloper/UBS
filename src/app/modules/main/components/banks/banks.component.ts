import { Component, OnInit, ViewChild } from '@angular/core';
import { BanksService } from 'src/app/services/banks.service';
import { Router } from '@angular/router';
import { IBankDTO } from '../../../../models/bank.model';
import { AdministrationBanksStateService } from '../../../../services/administration-banks-state.service';
import { DeleteDialogComponent } from '../../../../modals/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Components } from 'src/app/utils/enums';

@Component({
    selector: 'app-banks',
    templateUrl: './banks.component.html',
    styleUrls: ['./banks.component.scss'],
})
export class BanksComponent implements OnInit {
    items: IBankDTO[];
    pageSize: number = 10;
    totalElements: number;
    search: string;
    pageIndex: number;
    sortBy: string = '';
    sortDirection: string = '';
    isEditOrAddNewMode: boolean;
    rows = ['id', 'code', 'name', 'action'];
    column: any;
    columnsClasses: string[] = ['col-width15', 'col-width15', '', 'col-action'];
    page = Components.BANK;
    constructor(
        private banksService: BanksService,
        private stateService: AdministrationBanksStateService,
        private router: Router,
        private dialog: MatDialog,
    ) {
        this.router.getCurrentNavigation()?.extras.state;
        this.isEditOrAddNewMode = history.state?.editOrAddNewMode;
    }

    ngOnInit() {
        this.isEditOrAddNewBank();
        this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
    }

    getSearch(search: any, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string) {
        this.banksService.getSearch(search, pageNumber, pageSize, sortBy, sortDirection).subscribe(res => {
            this.column = res;
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
            data: { component: Components.BANK, id: id },
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
