import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RefinanceTableContent, TransformContent } from '../../../../models/refinance.model';
import { RefinanceService } from '../../../../services/refinance.service';
import { Components } from '../../../../utils/enums';
import { AdministrationBanksStateService } from '../../../../services/administration-banks-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { RefStatusModel } from '../../../../models/ref-status.model';
import * as dayjs from 'dayjs';

@Component({
    selector: 'app-refinance-table-view',
    templateUrl: './refinance-table-view.component.html',
    styleUrls: ['./refinance-table-view.component.scss'],
})
export class RefinanceTableViewComponent implements OnInit {
    @ViewChild('select') select: MatSelect;
    timeSelect: number;
    totalElements: number;
    pageSize: number = 10;
    sortBy: string = this.stateService.getSortBy();
    sortDirection: string = this.stateService.getSortDirection();
    rows: string[] = ['id', 'newBank', 'prevBank', 'debtorId', 'debtorName', 'refStatus', 'nextActionDate', 'updatedDate'];
    pageIndex: number = this.stateService.getPaginatorIndex();
    search: string = this.stateService.getSearchFieldValue();
    column: RefinanceTableContent = new RefinanceTableContent();
    columnsClasses: string[] = ['col-80', '', '', '', '', 'col-width20', 'col-80', 'col-160'];
    page = Components.LOAN;
    formGroup: FormGroup;
    statusesList: RefStatusModel[] = [];
    statuses: string[] = [];
    debtorTypesList = [
        { code: 'INDIVIDUAL', name: 'Fizičko lice' },
        { code: 'FARMER', name: 'Poljoprivrednik' },
        { code: 'ENTREPRENEUR', name: 'Preduzetnik' },
    ];
    debtorTypes: string[] = [];
    allStatusesSelected: boolean = false;
    openStatusesSelected: boolean = false;
    isNewBankChecked = this.stateService.getNewBank();
    isPrevBankChecked = this.stateService.getPrevBank();
    dashBoardData: any;
    startDate: string = '';
    endDate: string = '';

    constructor(
        private refinanceService: RefinanceService,
        private stateService: AdministrationBanksStateService,
        private router: Router,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
    ) {
        this.statusesList = this.activatedRoute.snapshot.data['statuses'];
        this.dashBoardData = this.router.getCurrentNavigation()?.extras.state || null;
    }

    ngOnInit(): void {
        if (this.stateService.getStatuses().length === 0) {
            this.statusesList.forEach(res => {
                this.statuses.push(res.code);
            });
            this.stateService.setStatuses(this.statuses);
        } else {
            this.statuses = this.stateService.getStatuses();
        }

        if (this.stateService.getDebtorTypes().length === 0) {
            this.debtorTypesList.forEach(res => {
                this.debtorTypes.push(res.code);
            });
            this.stateService.setDebtorTypes(this.debtorTypes);
        } else {
            this.debtorTypes = this.stateService.getDebtorTypes();
        }

        this.startDate = this.stateService.getStartDate();
        this.endDate = this.stateService.getEndDate();
        this.isNewBankChecked = this.stateService.getNewBank();
        this.isPrevBankChecked = this.stateService.getPrevBank();

        if (this.dashBoardData) {
            this.allStatusesSelected = false;
            this.openStatusesSelected = false;
            this.statuses = [];
            this.statuses.push(this.dashBoardData.refStatus.code);
            this.stateService.setStatuses(this.statuses);
            if (this.dashBoardData.bankSide === 'PREVIOUS') {
                this.isPrevBankChecked = true;
                this.isNewBankChecked = false;
            } else {
                this.isNewBankChecked = true;
                this.isPrevBankChecked = false;
            }
            this.stateService.setNewBank(this.isNewBankChecked);
            this.stateService.setPrevBank(this.isPrevBankChecked);
            // reset the rest of parameters to default values
            this.search = '';
            this.stateService.setSearchFieldValue(this.search);
            this.startDate = '';
            this.endDate = '';
            this.stateService.setStartDate(this.startDate);
            this.stateService.setEndDate(this.endDate);
            this.sortBy = '';
            this.sortDirection = '';
            this.stateService.setSortBy(this.sortBy);
            this.stateService.setSortDirection(this.sortDirection);
            this.debtorTypes = [];
            this.debtorTypesList.forEach(res => {
                this.debtorTypes.push(res.code);
            });
            this.stateService.setDebtorTypes(this.debtorTypes);
        } else {
            if (this.stateService.getStatusOptionSelected().length > 0) {
                this.allStatusesSelected = this.stateService.getStatusOptionSelected()[0];
                this.openStatusesSelected = this.stateService.getStatusOptionSelected()[1];
            } else {
                this.openStatusesSelected = true;
            }
        }
        this.stateService.setStatusOptionSelected([this.allStatusesSelected, this.openStatusesSelected]);

        this.createForm();
        setTimeout(() => {
            if (this.openStatusesSelected) {
                this.toggleOpenStatusesSelection();
            } else if (this.allStatusesSelected) {
                this.toggleAllStatusesSelection();
            }
        }, 0);

        this.getRefinanceData(
            this.search,
            this.pageIndex,
            this.pageSize,
            this.sortBy,
            this.sortDirection,
            this.statuses,
            this.debtorTypes,
            this.isNewBankChecked,
            this.isPrevBankChecked,
            this.startDate,
            this.endDate,
        );
    }

    toggleAllStatusesSelection() {
        if (this.allStatusesSelected) {
            this.openStatusesSelected = false;
            this.select.options.forEach((item: MatOption) => item.select());
            // in case dashboard data exists reset statuses to all statuses
            if (this.statuses.length && this.dashBoardData) {
                this.dashBoardData = null;
                this.statuses = [];
                this.statusesList.forEach(res => {
                    this.statuses.push(res.code);
                });
                this.stateService.setStatuses(this.statuses);
            }
        } else {
            this.select.options.forEach((item: MatOption) => item.deselect());
        }
        this.stateService.setStatusOptionSelected([this.allStatusesSelected, this.openStatusesSelected]);
    }

    toggleOpenStatusesSelection() {
        if (this.openStatusesSelected) {
            this.allStatusesSelected = false;
            this.select.options.forEach((item: MatOption) => {
                const status = this.statusesList.find(status => status.code === item.value);
                if (status && !status.finalStatus) {
                    item.select();
                } else {
                    item.deselect();
                }
            });
        }
        this.stateService.setStatusOptionSelected([this.allStatusesSelected, this.openStatusesSelected]);
    }

    setSearch(event: any) {
        this.search = event.target.value;
        this.pageIndex = 0;
        this.stateService.setSearchFieldValue(this.search);
        this.stateService.setPaginatorIndex(this.pageIndex);

        this.getRefinanceData(
            this.search,
            this.pageIndex,
            this.pageSize,
            this.sortBy,
            this.sortDirection,
            this.statuses,
            this.debtorTypes,
            this.isNewBankChecked,
            this.isPrevBankChecked,
            this.startDate,
            this.endDate,
        );
    }

    createForm() {
        this.formGroup = this.fb.group({
            search: [this.stateService.getSearchFieldValue()],
            prevBank: [this.stateService.getPrevBank()],
            newBank: [this.stateService.getNewBank()],
            statuses: [this.stateService.getStatuses()],
            debtorTypes: [this.stateService.getDebtorTypes()],
            startDate: [this.stateService.getStartDate()],
            endDate: [this.stateService.getEndDate()],
        });
    }

    getServerData(index: any) {
        this.getRefinanceData(
            '',
            index,
            10,
            this.sortBy,
            this.sortDirection,
            this.statuses,
            this.debtorTypes,
            this.isNewBankChecked,
            this.isPrevBankChecked,
            this.startDate,
            this.endDate,
        );
    }

    getRefinanceData(
        search: any,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        statuses: string[],
        debtorTypes: string[],
        newBank: boolean,
        prevBank: boolean,
        startDate: string,
        endDate: string,
    ) {
        this.refinanceService
            .getRefinance(search, pageNumber, pageSize, sortBy, sortDirection, statuses, debtorTypes, newBank, prevBank, startDate, endDate)
            .subscribe({
                next: items => {
                    let content;
                    const ref = new RefinanceTableContent();
                    items.content.forEach(item => {
                        content = TransformContent.transform(item);
                        ref.content.push(content);
                    });
                    this.column = ref;
                    this.column.totalElements = items.totalElements;
                },
                complete: () => {
                    setTimeout(() => {
                        const criticalElements = document.getElementsByClassName('critical');
                        for (let i = 0; i < criticalElements.length; i++) {
                            criticalElements[i]?.parentElement?.parentElement?.classList.add('critical-row');
                        }
                        const warningElements = document.getElementsByClassName('warning');
                        for (let i = 0; i < warningElements.length; i++) {
                            warningElements[i]?.parentElement?.parentElement?.classList.add('warning-row');
                        }
                    }, 0);
                },
            });
    }

    toggleSortOptions() {
        this.sortBy = this.stateService.getSortBy();
        this.sortDirection = this.stateService.getSortDirection();
        this.pageIndex = this.stateService.getPaginatorIndex();
        this.getRefinanceData(
            this.search,
            this.pageIndex,
            this.pageSize,
            this.sortBy,
            this.sortDirection,
            this.statuses,
            this.debtorTypes,
            this.isNewBankChecked,
            this.isPrevBankChecked,
            this.startDate,
            this.endDate,
        );
    }

    openRequestForm(id: number) {
        this.router.navigate(['/main/requests', id]);
    }

    onStatusOptionClick() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allStatusesSelected = newStatus;
        this.openStatusesSelected = false;
        this.stateService.setStatusOptionSelected([this.allStatusesSelected, this.openStatusesSelected]);
    }

    setStatusSearch(status: any) {
        let statuses: string[] = [];
        status.value.forEach((res: string) => {
            statuses.push(res);
        });

        if (this.timeSelect) {
            clearTimeout(this.timeSelect);
        }
        this.timeSelect = window.setTimeout(() => {
            if (statuses.length === 0) {
                this.statuses = [];
                this.statusesList.forEach(res => {
                    this.statuses.push(res.code);
                });
                statuses = this.statuses;
                this.stateService.setStatusOptionSelected([true, this.openStatusesSelected]);
            } else {
                this.statuses = statuses;
            }
            this.stateService.setStatuses(statuses);

            this.getRefinanceData(
                this.search,
                this.pageIndex,
                this.pageSize,
                this.sortBy,
                this.sortDirection,
                statuses,
                this.debtorTypes,
                this.isNewBankChecked,
                this.isPrevBankChecked,
                this.startDate,
                this.endDate,
            );
        }, 100);
    }

    setDebtorTypeSearch(debtorType: any) {
        let debtorTypes: string[] = [];
        debtorType.value.forEach((res: string) => {
            debtorTypes.push(res);
        });

        if (this.timeSelect) {
            clearTimeout(this.timeSelect);
        }
        this.timeSelect = window.setTimeout(() => {
            if (debtorTypes.length === 0) {
                this.debtorTypes = [];
                this.debtorTypesList.forEach(res => {
                    this.debtorTypes.push(res.code);
                });
                debtorTypes = this.debtorTypes;
            } else {
                this.debtorTypes = debtorTypes;
            }
            this.stateService.setDebtorTypes(debtorTypes);

            this.getRefinanceData(
                this.search,
                this.pageIndex,
                this.pageSize,
                this.sortBy,
                this.sortDirection,
                this.statuses,
                debtorTypes,
                this.isNewBankChecked,
                this.isPrevBankChecked,
                this.startDate,
                this.endDate,
            );
        }, 100);
    }

    newBankChange() {
        this.isNewBankChecked = !this.isNewBankChecked;
        this.stateService.setNewBank(this.isNewBankChecked);
        this.pageIndex = this.stateService.getPaginatorIndex();
        this.statuses = this.stateService.getStatuses();
        this.debtorTypes = this.stateService.getDebtorTypes();
        this.sortDirection = this.stateService.getSortDirection();
        this.sortBy = this.stateService.getSortBy();
        this.isPrevBankChecked = this.stateService.getPrevBank();
        this.getRefinanceData(
            this.search,
            this.pageIndex,
            this.pageSize,
            this.sortBy,
            this.sortDirection,
            this.statuses,
            this.debtorTypes,
            this.isNewBankChecked,
            this.isPrevBankChecked,
            this.startDate,
            this.endDate,
        );
    }

    prevBankChange() {
        this.isPrevBankChecked = !this.isPrevBankChecked;
        this.stateService.setPrevBank(this.isPrevBankChecked);
        this.pageIndex = this.stateService.getPaginatorIndex();
        this.statuses = this.stateService.getStatuses();
        this.debtorTypes = this.stateService.getDebtorTypes();
        this.sortDirection = this.stateService.getSortDirection();
        this.sortBy = this.stateService.getSortBy();
        this.isNewBankChecked = this.stateService.getNewBank();
        this.getRefinanceData(
            this.search,
            this.pageIndex,
            this.pageSize,
            this.sortBy,
            this.sortDirection,
            this.statuses,
            this.debtorTypes,
            this.isNewBankChecked,
            this.isPrevBankChecked,
            this.startDate,
            this.endDate,
        );
    }

    setStartDate() {
        if (this.formGroup.get('startDate')?.value) {
            this.startDate = dayjs(this.formGroup.get('startDate')?.value).format('YYYY-MM-DD') + 'T00:00:00';
        } else {
            this.startDate = '';
        }
        this.stateService.setStartDate(this.startDate);
    }

    setEndDate() {
        if (this.formGroup.get('endDate')?.value) {
            this.endDate = dayjs(this.formGroup.get('endDate')?.value).format('YYYY-MM-DD') + 'T23:59:59.999';
        } else {
            this.endDate = '';
        }
        this.stateService.setEndDate(this.endDate);
        this.getRefinanceData(
            this.search,
            this.pageIndex,
            this.pageSize,
            this.sortBy,
            this.sortDirection,
            this.statuses,
            this.debtorTypes,
            this.isNewBankChecked,
            this.isPrevBankChecked,
            this.startDate,
            this.endDate,
        );
    }

    clearDate() {
        const startDate = this.formGroup.get('startDate');
        const endDate = this.formGroup.get('endDate');
        if (startDate?.value && endDate?.value) {
            startDate?.setValue('');
            endDate?.setValue('');
            this.setStartDate();
            this.setEndDate();
        }
    }
}
