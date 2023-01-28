import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AdministrationBanksStateService {
    private paginatorIndexSubject$ = new BehaviorSubject<number>(0);
    private searchFieldValueSubject$ = new BehaviorSubject<string>('');
    private sortBySubject$ = new BehaviorSubject<string>('');
    private sortDirectionSubject$ = new BehaviorSubject<string>('');
    private newBankSubject$ = new BehaviorSubject<boolean>(true);
    private prevBankSubject$ = new BehaviorSubject<boolean>(true);
    private statusesSubject$ = new BehaviorSubject<string[]>([]);
    private statusOptionSelectedSubject$ = new BehaviorSubject<boolean[]>([]);
    private debtorTypesSubject$ = new BehaviorSubject<string[]>([]);
    private startDateSubject$ = new BehaviorSubject<string>('');
    private endDateSubject$ = new BehaviorSubject<string>('');
    private paginator$: Observable<number> = this.paginatorIndexSubject$.asObservable();
    private searchFieldValue$: Observable<string> = this.searchFieldValueSubject$.asObservable();
    private sortBy$: Observable<string> = this.sortBySubject$.asObservable();
    private sortDirection$: Observable<string> = this.sortDirectionSubject$.asObservable();
    private newBank$: Observable<boolean> = this.newBankSubject$.asObservable();
    private prevBank$: Observable<boolean> = this.prevBankSubject$.asObservable();
    private statuses: Observable<string[]> = this.statusesSubject$.asObservable();
    private statusOptionSelected: Observable<boolean[]> = this.statusOptionSelectedSubject$.asObservable();
    private debtorTypes: Observable<string[]> = this.debtorTypesSubject$.asObservable();
    private startDateSubject: Observable<string> = this.startDateSubject$.asObservable();
    private endDateSubject: Observable<string> = this.endDateSubject$.asObservable();
    constructor() {}

    setStatuses(value: string[]) {
        this.statusesSubject$.next(value);
    }

    getStatuses() {
        return this.statusesSubject$.getValue();
    }

    setStatusOptionSelected(value: boolean[]) {
        this.statusOptionSelectedSubject$.next(value);
    }

    getStatusOptionSelected() {
        return this.statusOptionSelectedSubject$.getValue();
    }

    setDebtorTypes(value: string[]) {
        this.debtorTypesSubject$.next(value);
    }

    getDebtorTypes() {
        return this.debtorTypesSubject$.getValue();
    }

    getNewBank() {
        return this.newBankSubject$.getValue();
    }

    setNewBank(value: boolean) {
        this.newBankSubject$.next(value);
    }

    getPrevBank() {
        return this.prevBankSubject$.getValue();
    }

    setPrevBank(value: boolean) {
        this.prevBankSubject$.next(value);
    }

    setPaginatorIndex(pageNumber: number) {
        this.paginatorIndexSubject$.next(pageNumber);
    }

    getPaginatorIndex(): number {
        return this.paginatorIndexSubject$.getValue();
    }

    setSearchFieldValue(search: string) {
        this.searchFieldValueSubject$.next(search);
    }

    getSearchFieldValue(): string {
        return this.searchFieldValueSubject$.getValue();
    }

    setSortBy(sortBy: string) {
        this.sortBySubject$.next(sortBy);
    }

    getSortBy(): string {
        return this.sortBySubject$.getValue();
    }

    setSortDirection(sortDirection: string) {
        this.sortDirectionSubject$.next(sortDirection);
    }

    getSortDirection(): string {
        return this.sortDirectionSubject$.getValue();
    }

    setStartDate(date: string) {
        this.startDateSubject$.next(date);
    }

    getStartDate(): string {
        return this.startDateSubject$.getValue();
    }

    setEndDate(date: string) {
        this.endDateSubject$.next(date);
    }

    getEndDate(): string {
        return this.endDateSubject$.getValue();
    }

    resetValuesToDefault() {
        this.paginatorIndexSubject$.next(0);
        this.searchFieldValueSubject$.next('');
        this.sortBySubject$.next('');
        this.sortDirectionSubject$.next('');
        this.newBankSubject$.next(true);
        this.prevBankSubject$.next(true);
        this.statusesSubject$.next([]);
        this.statusOptionSelectedSubject$.next([]);
        this.debtorTypesSubject$.next([]);
        this.startDateSubject$.next('');
        this.endDateSubject$.next('');
    }
}
