import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from 'src/app/modals/delete-dialog/delete-dialog.component';
import { AdministrationBanksStateService } from 'src/app/services/administration-banks-state.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Components } from 'src/app/utils/enums';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    items: any[];
    pageSize: number = 10;
    totalElements: number;
    search: string = this.stateService.getSearchFieldValue();
    pageIndex: number = this.stateService.getPaginatorIndex();
    sortBy: string = '';
    sortDirection: string = '';
    isEditOrAddNewMode: boolean;
    rows: string[] = ['id', 'code', 'subject', 'action'];
    column: any;
    columnsClasses: string[] = ['col-width15', '', '', 'col-action'];
    page = Components.MESSAGE;

    constructor(
        private messageService: MessagesService,
        private stateService: AdministrationBanksStateService,
        private router: Router,
        private dialog: MatDialog,
    ) {
        this.router.getCurrentNavigation()?.extras.state;
        this.isEditOrAddNewMode = history.state?.editOrAddNewMode;
    }

    ngOnInit(): void {
        this.isEditOrAddNewMessage();
        this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
    }

    getSearch(search: any, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string) {
        this.messageService.getSearch(search, pageNumber, pageSize, sortBy, sortDirection).subscribe((res: any) => {
            this.column = res;
            this.totalElements = res.totalElements;
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

    isEditOrAddNewMessage() {
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
            data: { component: Components.MESSAGE, id: id },
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
