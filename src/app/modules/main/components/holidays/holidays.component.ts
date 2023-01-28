import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdministrationBanksStateService } from '../../../../services/administration-banks-state.service';
import { HolidayService } from 'src/app/services/holiday.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from 'src/app/modals/delete-dialog/delete-dialog.component';
import { Components } from 'src/app/utils/enums';
import { HolidayTableContent } from 'src/app/models/holiday.model';
import { TransformContent } from 'src/app/models/holiday.model';

@Component({
    selector: 'app-holidays',
    templateUrl: './holidays.component.html',
    styleUrls: ['./holidays.component.scss'],
})
export class HolidaysComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    holidayItm: any[];
    pageSize: number = 10;
    totalElements: number;
    search: string = this.stateService.getSearchFieldValue();
    pageIndex: number = this.stateService.getPaginatorIndex();
    sortBy: string = '';
    sortDirection: string = '';
    isEditOrAddNewMode: boolean;
    rows: string[] = ['id', 'name', 'endYear', 'action'];
    column: HolidayTableContent = new HolidayTableContent();
    columnsClasses: string[] = ['col-width15', '', '', 'col-action'];
    page = Components.HOLIDAY;

    constructor(
        private holidayService: HolidayService,
        private stateService: AdministrationBanksStateService,
        private router: Router,
        private dialog: MatDialog,
    ) {
        this.router.getCurrentNavigation()?.extras.state;
        this.isEditOrAddNewMode = history.state?.editOrAddNewMode;
    }

    ngOnInit(): void {
        this.isEditOrAddNewBank();
        this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
    }

    getSearch(search: any, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string) {
        this.holidayService.getSearchHolidays(search, pageNumber, pageSize, sortBy, sortDirection).subscribe(items => {
            let content;
            const ref = new HolidayTableContent();
            items.content.forEach(item => {
                content = TransformContent.transform(item);
                ref.content.push(content);
            });
            this.column = ref;
            this.column.totalElements = items.totalElements;
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
            data: { component: Components.HOLIDAY, id: id },
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
