import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../../../../models/common.model';
import { IBankDTO } from '../../../../models/bank.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdministrationBanksStateService } from '../../../../services/administration-banks-state.service';
import { Router } from '@angular/router';
import { Components } from '../../../../utils/enums';

@Component({
    selector: 'app-reusable-table',
    templateUrl: './reusable-table.component.html',
    styleUrls: ['./reusable-table.component.scss'],
})
export class ReusableTableComponent implements OnInit, OnChanges {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() dataSource: Observable<IPage<IBankDTO>>;
    @Input() rows: any;
    @Input() totalElements: number;
    @Input() columns: any;
    @Input() columnsClasses: any;
    @Input() pageIndex: number;
    @Input() page: string;
    @Input() isRefinanceLoan = false;
    @Input() deleteRowOption = true;
    @Output() pageIndexEmitter = new EventEmitter();
    @Output() sortByEmitter = new EventEmitter();
    @Output() deleteEmitter = new EventEmitter();
    @Output() idEmitter = new EventEmitter();
    @Input() sortBy: string;
    @Input() sortDirection: string;
    sortDirections: string[] = ['', 'ASC', 'DESC'];
    pageSize = 10;

    constructor(private stateService: AdministrationBanksStateService, private router: Router) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        this.totalElements = this.columns?.totalElements;
    }

    emitSortBy(sortBy: string) {
        this.stateService.setPaginatorIndex(0);
        this.paginator.pageIndex = 0;
        let sortIndex: number;
        if (sortBy !== this.sortBy) {
            sortIndex = 1; // ASC
            this.sortBy = sortBy;
            this.sortDirection = this.sortDirections[sortIndex];
        } else {
            sortIndex = (this.sortDirections.indexOf(this.sortDirection) + 1) % 3;
            this.sortDirection = this.sortDirections[sortIndex];
            if (this.sortDirection === '') {
                this.sortBy = '';
            }
        }
        this.stateService.setSortBy(this.sortBy);
        this.stateService.setSortDirection(this.sortDirection);
        this.sortByEmitter.emit();
    }

    getIconClass(sortBy: string): string {
        if ((this.sortBy === sortBy && this.sortDirection === '') || this.sortBy !== sortBy) {
            return 'sort.svg';
        } else if (this.sortBy === sortBy && this.sortDirection === 'ASC') {
            return 'sort-asc.svg';
        } else if (this.sortBy === sortBy && this.sortDirection === 'DESC') {
            return 'sort-desc.svg';
        } else {
            return '';
        }
    }

    sendPageIndex(event: PageEvent) {
        this.stateService.setPaginatorIndex(event.pageIndex);
        return this.pageIndexEmitter.emit(event.pageIndex);
    }

    onChangeClick(id: number) {
        if (this.page === Components.BANK) {
            this.router.navigate(['main/edit-bank/', id]);
        } else if (this.page === Components.USER) {
            this.router.navigate(['/main/edit-user/', id]);
        } else if (this.page === Components.LOAN) {
            this.router.navigate(['/main/edit-loan/', id]);
        } else if (this.page === Components.HOLIDAY) {
            this.router.navigate(['/main/edit-holiday/', id]);
        } else if (this.page === Components.MESSAGE) {
            this.router.navigate(['/main/edit-message/', id]);
        } else if (this.page === Components.APPLICATIONS) {
            this.router.navigate(['/main/edit-application/', id]);
        }
    }

    onDeleteClick(id: number) {
        this.deleteEmitter.emit(id);
    }

    // on row click handle for refinance table
    emitId(id: number) {
        if(this.isRefinanceLoan) {
            this.idEmitter.emit(id);
        }
    }
}
