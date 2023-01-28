import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { IPage } from 'src/app/models/common.model';
import { ILoanType } from 'src/app/models/loan-type.model';
import { LoanTypeService } from 'src/app/services/loan-type.service';
import { AdministrationBanksStateService } from '../../../../services/administration-banks-state.service';
import { Router } from '@angular/router';
import { Components } from 'src/app/utils/enums';
import { DeleteDialogComponent } from 'src/app/modals/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-loan-types',
    templateUrl: './loan-types.component.html',
    styleUrls: ['./loan-types.component.scss'],
})
export class LoanTypesComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    loanType: ILoanType[];
    pageSize: number = 10;
    totalElements: number;
    search: string = this.stateService.getSearchFieldValue();
    pageIndex: number = this.stateService.getPaginatorIndex();
    sortBy: string = '';
    sortDirection: string = '';
    isEditOrAddNewMode: boolean;
    rows: string[] = ['id', 'code', 'categoryType', 'name', 'action'];
    column: any;
    columnsClasses: string[] = ['col-width15', '', '', '', 'col-action'];
    page = Components.LOAN;
    replaceLoan: any;

    constructor(
        private loanTypeService: LoanTypeService,
        private stateService: AdministrationBanksStateService,
        private router: Router,
        private dialog: MatDialog,
    ) {
        this.router.getCurrentNavigation()?.extras.state;
        this.isEditOrAddNewMode = history.state?.editOrAddNewMode;
    }

    ngOnInit(): void {
        this.isEditOrAddNewLoanType();
        this.getSearch(this.search, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection);
    }

    getSearch(search: any, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string) {
        this.loanTypeService.searchLoanTypes(search, pageNumber, pageSize, sortBy, sortDirection).subscribe((res: IPage<ILoanType>) => {
            this.column = res;
            this.totalElements = res.totalElements;

            this.replaceLoan = res.content;
            this.replaceLoan.forEach((cat: any) => {
                if (cat.categoryType == 'CREDIT') {
                    cat.categoryType = 'Kredit';
                } else if (cat.categoryType == 'OVERDRAFT') {
                    cat.categoryType = 'Prekoracenje po racunu';
                } else if ((cat.categoryType = 'CREDIT_CARD')) {
                    cat.categoryType = 'Kreditna kartica';
                }
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

    isEditOrAddNewLoanType() {
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
            data: { component: Components.LOAN, id: id },
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
