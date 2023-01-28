import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { IBankDTO } from 'src/app/models/bank.model';
import { IPage } from 'src/app/models/common.model';
import { ILoanType } from 'src/app/models/loan-type.model';
import { DebtInfoRequestModel, DebtRequestModel, LoanTransformer, RequestModel, SaveDeptInfoModel } from 'src/app/models/refinance.model';
import { IUserDTO } from 'src/app/models/user.model';
import { BanksService } from 'src/app/services/banks.service';
import { RefinanceService } from 'src/app/services/refinance.service';
import { UserService } from 'src/app/services/user.service';
import * as dayjs from 'dayjs';
import { TranslateService } from 'src/app/services/translate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InformationDialog } from '../../../../modals/information-dialog/information-dialog';
import { Reasons, RefinanceUrl, Statuses } from '../../../../utils/enums';
import { DateAdapter } from '@angular/material/core';
import { MyDateAdapter } from './datepickerFormat/dateAdapter';

@Component({
    selector: 'app-refinance',
    templateUrl: './refinance.component.html',
    styleUrls: ['./refinance.component.scss'],
    providers: [{ provide: DateAdapter, useClass: MyDateAdapter }],
})
export class RefinanceComponent implements OnInit {
    checkForDelete: Array<any> = [];
    filterArr: boolean = false;
    previousDocArray: Array<any> = [];
    shiftLeft: boolean = true;
    switchButtonMode: boolean = false;
    hideMenu: boolean = false;
    documentActionArray: Array<any> = [];
    templateRefAction: any;
    addDocumentActionCode: string;
    urls: any[] = [];
    banks: IBankDTO[];
    previousBanks: IBankDTO[];
    searchBank: string = '';
    pageSize: number = 50;
    file: File = null!;
    type: string = '';
    search: string = '';
    loanTypes: ILoanType[];
    currentUser: IUserDTO;
    refinanceForm: FormGroup;
    index: number;
    isFormSubmitted: boolean = false;
    validationMessageJmbg: string = '';
    validationMessageBankAccount: string = '';
    validationMessageReferenceNumber: string = '';
    id: number;
    refinanceRequst: RequestModel;
    isUserBank = true;
    debtroName: string;
    refloanId: number;
    isButtonVisible = true;
    decresedVal: any;
    isSubmitted = false;
    isStatusDraft = true;
    isStatusConfirmed = false;
    isStatusDebtInfoSubmited = false;
    isStatusTransSubmited = false;
    isStatusTransCheckpending = false;
    isUserPrevBank = false;
    status: string;
    url: string;
    haveCancel = false;
    isDownloadVisible = false;
    debtForm: FormGroup;
    debtTrue: boolean = false;
    debtArrForm: FormGroup;
    toggleDrop: boolean = false;
    docTypeName: string;
    clearIsTrue: string;
    public debtorTypes = [
        { code: 'INDIVIDUAL', name: 'Fizičko lice' },
        { code: 'FARMER', name: 'Poljoprivrednik' },
        { code: 'ENTREPRENEUR', name: 'Preduzetnik' },
    ];
    refinanceRequestComments: any = [];
    refinanceRequestHistory: any = [];
    refinanceRequestDocuments: any = [];
    isExternalIdRequired: boolean = false;
    sendDebtDocument: Array<any> = [];
    listAction: Array<any> = [];
    @ViewChild('searchInput') searchField: ElementRef;

    constructor(
        private router: Router,
        private refinanceService: RefinanceService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private banksService: BanksService,
        private userService: UserService,
        private translateService: TranslateService,
        private activateRoute: ActivatedRoute,
        private dialog: MatDialog,
    ) {
        this.currentUser = this.userService.getUserInfo();
        this.refinanceRequst = this.activateRoute.snapshot?.data['requestLoans'];
        this.debtroName = this.refinanceRequst?.debtorName;
        this.refloanId = this.refinanceRequst?.id;
        this.refinanceRequestComments = this.refinanceRequst?.refRequestReasons;
        this.refinanceRequestDocuments = this.refinanceRequst?.documents?.map(item => item.document) || [];
        this.id = Number(this.activateRoute.snapshot.paramMap?.get('id'));
    }

    ngOnInit(): void {
        this.getLoanSearch(this.search, 0, this.pageSize);
        this.getSearch(this.search, 0, this.pageSize);
        this.createForm();

        // fix for page reload
        if (!this.currentUser) {
            this.router.navigate(['main/refinance-table']);
        }

        if (this.id && this.refinanceRequst) {
            this.checkStatus();
            this.refinanceService.getHistory(this.id).subscribe(res => {
                this.refinanceRequestHistory = res;
            });
        } else {
            this.addDocumentActionCode = 'CREATE_DRAFT';
            this.refRequestLoans().push(this.newLoanRequest());
            this.refinanceForm.get('newBankId')?.patchValue(this.currentUser?.bank.id);
        }
        this.addDocumentAction();

        this.debtArrForm = this.fb.group({
            externalId: [''],
            debtAmount: [''],
            debtDecreaseAmount: [''],
            debtFeeAmount: [''],
            debtTotalDecreaseAmount: [''],
            debtTotalAmount: [''],
            previousBankAccount: [''],
            paymentModel: [''],
            paymentReferenceNumber: [''],
        });
    }

    //Save dept info
    createDeptForm() {
        this.debtForm = this.fb.group({
            sendDebtInfoRequestItems: this.fb.array([]),
        });
    }

    //Get bank email domains
    getDeptArr(): FormArray {
        return this.debtForm.get('sendDebtInfoRequestItems') as FormArray;
    }

    //Add to array
    addDeptToArray() {
        this.getDeptArr().push(this.debtArrForm);
    }

    get sendDebtInfoRequestItems(): FormArray {
        return this.debtForm.get('sendDebtInfoRequestItems') as FormArray;
    }

    saveDebtInfo() {
        if (this.id) {
            const arr = this.refinanceRequestDocuments?.filter((el: any) => el.documentType !== 'REQUEST');
            arr.forEach((sm: any) => {
                this.sendDebtDocument.push(sm.id);
            });
        }

        this.debtTrue = true;
        this.isFormSubmitted = true;

        let debtRequestModel: DebtRequestModel = new DebtRequestModel();
        let saveDeptInfoModel: SaveDeptInfoModel = new SaveDeptInfoModel();
        this.refRequestLoans().controls.forEach((loans: any) => {
            loans.get('externalId').enable();
            loans.get('debtTotalAmount').enable();
            loans.get('previousBankAccount').enable();
            loans.get('paymentReferenceNumber').enable();
            loans.get('paymentModel').enable();
            loans.get('debtTotalDecreaseAmount').enable();
            loans.get('debtDecreaseAmount').enable();
            loans.get('debtAmount').enable();
            loans.get('debtFeeAmount').enable();
            this.parseDebtRequestModel(loans.value);
            debtRequestModel = loans.value;
            saveDeptInfoModel.saveDebtInfoRequestItems.push(debtRequestModel);
        });

        if (this.sendDebtDocument.length > 0) {
            saveDeptInfoModel?.documents.push(...this.sendDebtDocument);
        }

        this.refinanceService.saveDept(this.id, saveDeptInfoModel).subscribe({
            next: res => {
                this.translateService.showMessage('success_recorded');
                this.router.navigate(['main/refinance-table']);
            },
            error: error => {
                this.refRequestLoans().controls.forEach((loans: any) => {
                    loans.get('externalId').disable();
                });
                error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    checkStatus() {
        this.populateAllData();
        const newBankId = this.refinanceRequst.newBank.id;
        const userBankId = this.currentUser?.bank.id;

        if (userBankId === newBankId && this.refinanceRequst.refStatus.code == Statuses.DRAFT) {
            this.isStatusDraft = true;
            this.haveCancel = true;
            this.addDocumentActionCode = 'CREATE_DRAFT';
            this.isUserBank = true;
            this.refRequestLoans().controls.forEach((loan: AbstractControl, index: number) => {
                this.checkValidators(index);
            });
        } else if (this.refinanceRequst.refStatus.code === Statuses.SUBMITTED) {
            this.status = Reasons.NEED_UPDATE;
            this.url = RefinanceUrl.NEED_UPDATE;
            if (userBankId === newBankId) {
                this.isSubmitted = true;
                this.isStatusDraft = false;
                this.addDocumentActionCode = '';
                this.isButtonVisible = false;
                this.refinanceForm.disable();
            } else {
                this.addDocumentActionCode = 'SEND_DEBT_INFO';
                this.isUserBank = false;
                this.isButtonVisible = true;
                this.isStatusDraft = false;
                this.isSubmitted = true;
                this.refinanceForm.disable();
                this.enableField();
            }
        } else if (this.refinanceRequst.refStatus.code === Statuses.DEBT_INFO_SUBMITTED) {
            this.isDownloadVisible = true;
            this.addDocumentActionCode = 'SUBMIT_TRANS';
            this.status = Reasons.NEED_ADJUSTMENT;
            this.url = RefinanceUrl.NEED_ADJUSTMENT;
            if (userBankId === newBankId) {
                this.isStatusDebtInfoSubmited = true;
                this.isUserBank = false;
                this.isStatusDraft = false;
                this.refinanceForm.disable();
            } else {
                this.isUserBank = false;
                this.isStatusDebtInfoSubmited = false;
                this.isUserPrevBank = true;
                this.refinanceForm.disable();
            }
        } else if (this.refinanceRequst.refStatus.code === Statuses.TRANS_SUBMITTED) {
            this.isDownloadVisible = true;

            this.status = Reasons.NEED_TRANS_CHECK;
            this.url = RefinanceUrl.NEED_TRANS_CHECK;
            if (userBankId === newBankId) {
                this.isUserBank = false;
                this.addDocumentActionCode = '';
                this.isStatusTransSubmited = false;
                this.isUserPrevBank = true;
                this.refinanceForm.disable();
            } else {
                this.addDocumentActionCode = 'CONFIRM_TRANS';
                this.isStatusTransSubmited = true;
                this.isUserBank = false;
                this.isStatusDraft = false;
                this.refinanceForm.disable();
            }
        } else if (this.refinanceRequst.refStatus.code === Statuses.TRANS_CHECK_PENDING) {
            this.isDownloadVisible = true;

            if (userBankId === newBankId) {
                this.addDocumentActionCode = 'UPDATE_TRANS';
                this.isStatusTransCheckpending = true;
                this.isButtonVisible = true;
                this.isStatusDraft = false;
                this.isUserBank = false;
                this.refinanceForm.disable();
            } else {
                this.addDocumentActionCode = '';
                this.isStatusDraft = false;
                this.isStatusTransCheckpending = false;
                this.isStatusDraft = false;
                this.isUserBank = false;
                this.isUserPrevBank = true;
                this.refinanceForm.disable();
            }
        } else if (this.refinanceRequst.refStatus.code !== Statuses.SUBMITTED && this.refinanceRequst.refStatus.code !== Statuses.DRAFT) {
            this.isDownloadVisible = true;
            this.isStatusConfirmed = true;
            this.addDocumentActionCode = '';
            this.isUserBank = false;
            this.isStatusDraft = false;
            this.refinanceForm.disable();
        } else {
            this.addDocumentActionCode = '';
            this.isUserBank = false;
            this.isStatusDraft = true;
            this.refinanceForm.disable();
            this.isDownloadVisible = true;
        }
    }

    populateAllData() {
        this.refinanceForm.get('debtorType')?.patchValue(this.refinanceRequst.debtorType);
        this.refinanceForm.get('debtorName')?.patchValue(this.refinanceRequst.debtorName);
        this.refinanceForm.get('debtorId')?.patchValue(this.refinanceRequst.debtorId);
        this.refinanceForm.get('prevBankId')?.patchValue(this.refinanceRequst.prevBank.id);
        this.refinanceForm.get('newBankId')?.patchValue(this.refinanceRequst.newBank.id);
        this.refinanceRequst.refRequestLoans.forEach((loan, index) => {
            const content = LoanTransformer.transform(loan);
            this.refRequestLoans().push(this.newLoanRequest(content));
            this.formatAmount(index, 'amount');
            this.formatAmount(index, 'debtAmount');
            this.formatAmount(index, 'debtDecreaseAmount');
            this.formatAmount(index, 'debtFeeAmount');
            this.formatAmount(index, 'debtTotalDecreaseAmount');
            this.formatAmount(index, 'debtTotalAmount');
        });

        if (this.refinanceRequst.documents) {
            this.refinanceRequst.documents.forEach((documentId, index) => {
                this.refRequestDocuments().controls[index].patchValue(documentId.document);
            });
        }
    }

    enableField() {
        this.refRequestLoans().controls.forEach((loans: AbstractControl) => {
            loans.get('externalId')?.enable();
            loans.get('exernalId')?.setValidators(Validators.required);
            this.isExternalIdRequired = true;
            if (loans.get('externalId')?.value) {
                loans.get('externalId')?.disable();
            }
            loans.get('debtAmount')?.enable();
            loans.get('debtDecreaseAmount')?.enable();
            loans.get('debtFeeAmount')?.enable();
            loans.get('debtTotalDecreaseAmount')?.enable();
            loans.get('debtTotalAmount')?.disable();
            loans.get('previousBankAccount')?.enable();
            loans.get('paymentReferenceNumber')?.enable();
            loans.get('paymentModel')?.enable();
            loans.updateValueAndValidity();
        });

        this.setValidators();
    }

    setValidators() {
        this.refRequestLoans().controls.forEach((loans: AbstractControl) => {
            loans.get('debtAmount')?.setValidators(Validators.required);
            loans.get('debtDecreaseAmount')?.setValidators(Validators.required);
            loans.get('debtFeeAmount')?.setValidators(Validators.required);
            loans.get('debtTotalDecreaseAmount')?.setValidators(Validators.required);
            loans.get('debtTotalAmount')?.setValidators(Validators.required);
            loans.get('previousBankAccount')?.setValidators(Validators.required);
            loans.updateValueAndValidity();
        });
    }

    createForm() {
        this.refinanceForm = this.fb.group({
            debtorType: ['', Validators.required],
            debtorName: ['', Validators.required],
            debtorId: ['', Validators.required],
            prevBankId: ['', Validators.required],
            newBankId: [{ value: '', disabled: true }, Validators.required],
            refRequestLoans: this.fb.array([]),
            documents: this.fb.array(this.refinanceRequestDocuments),
        });
    }

    backgroundMenuBtn() {
        this.switchButtonMode = false;
    }

    clearDate(i: number) {
        const contractDate = this.refRequestLoans().controls[i].get('contractDate');
        contractDate?.setValue('');
        this.checkValidators(i);
    }

    allowOnlyDigits(i: number, controlName: string) {
        let control;
        if (i !== -1) {
            control = this.refRequestLoans().controls[i].get(controlName);
        } else {
            control = this.refinanceForm.controls[controlName];
        }
        if (control) {
            control.setValue(control.value.replace(/\D/g, ''));
        }
    }

    allowOnlyLettersDigitsAndDashes(i: number, controlName: string) {
        const control = this.refRequestLoans().controls[i].get(controlName);
        if (control?.value) {
            control.setValue(
                control.value.replace(/[^a-zA-Z\u0400-\u04FF\u010D\u010C\u0107\u0106\u017E\u017D\u0161\u0160\u0111\u0110\s\d\-]/g, ''),
            );
        }
    }

    allowOnlyDigitsAndDashes(i: number, controlName: string) {
        const control = this.refRequestLoans().controls[i].get(controlName);
        if (control?.value) {
            control.setValue(control.value.replace(/[^\d\-]/g, ''));
        }
    }

    allowOnlyDigitsAndDot(i: number, controlName: string) {
        const amount = this.refRequestLoans().controls[i].get(controlName);
        if (amount && amount.value) {
            const formattedAmount = amount.value
                .replace(',', '.')
                .replace(/[^\d\.]/g, '')
                .replace(/\./, 'x')
                .replace(/\./g, '')
                .replace(/x/, '.');
            amount.setValue(formattedAmount);
        }
    }

    allowOnlyDigitsAndDotForDescreasedAmount(i: number, controlName: string) {
        const amount = this.refRequestLoans().controls[i].get(controlName);
        if (amount && amount.value) {
            const formattedAmount = amount.value.replace(',', '.').replace(/\./, 'x').replace(/\./g, '').replace(/x/, '.');
            amount.setValue(formattedAmount);
        }
    }

    formatVal(event: any) {
        let value = event.value;
        event.value = value?.substr(0, 1) + value?.substr(1).replace('-', '');
    }

    // on input focus out and populate data
    formatAmount(i: number, controlName: string) {
        const amount = this.refRequestLoans().controls[i].get(controlName);
        const moneyFormatter = new Intl.NumberFormat('sr', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        if (amount && (amount.value || amount.value === 0)) {
            const formattedAmount = moneyFormatter.format(amount.value);
            amount.setValue(formattedAmount);
        }
    }

    // on input focus
    formatAmountAsNumber(i: number, controlName: string, event?: any) {
        const amount = this.refRequestLoans().controls[i].get(controlName);
        if (amount && amount.value) {
            const formattedAmount = amount.value.replace(/\./g, '').replace(',', '.');
            amount.setValue(formattedAmount);
        }
        event?.target?.select();
    }

    // convert amount before send request to BE and when calculating amount
    convertAmountToNumber(value: string) {
        return Number(value.replace(/\./g, '').replace(',', '.'));
    }

    formatBankAccount(i: number, controlName: string) {
        const bankAccount = this.refRequestLoans().controls[i].get(controlName);
        if (bankAccount && bankAccount.value && /^((\d{3}\-\d{0,13}\-\d{2})|(\d{5,18}))$/.test(bankAccount.value)) {
            let formattedBankAccount = bankAccount.value.replace(/\D/g, '');
            const leadingZero = '0'.repeat(18 - formattedBankAccount.length);
            formattedBankAccount =
                formattedBankAccount.slice(0, 3) +
                '-' +
                leadingZero +
                formattedBankAccount.slice(3, formattedBankAccount.length - 2) +
                '-' +
                formattedBankAccount.slice(formattedBankAccount.length - 2);
            bankAccount.setValue(formattedBankAccount);
        }
    }

    setJmbgMbValidator() {
        const debtorId = this.refinanceForm.get('debtorId');
        const debtorType = this.refinanceForm.get('debtorType');
        if (debtorId?.value && debtorType?.value) {
            debtorId?.setAsyncValidators(this.jmbgValidator(debtorType?.value));
            debtorId.updateValueAndValidity();
            debtorId?.clearAsyncValidators();
        }
    }

    jmbgValidator(debtorType: string): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.refinanceService.checkDebtorValidity(control.value, debtorType).pipe(
                map(res => {
                    if (typeof res === 'string') {
                        this.validationMessageJmbg = res;
                        return { jmbgInvalid: true };
                    } else {
                        return null;
                    }
                }),
            );
        };
    }

    setBankAccountValidator(i: number) {
        const bankAccount = this.refRequestLoans().controls[i].get('previousBankAccount');
        if (bankAccount?.value) {
            bankAccount?.setAsyncValidators(this.bankAccountValidator());
            bankAccount.updateValueAndValidity();
            bankAccount?.clearAsyncValidators();
        }
    }

    bankAccountValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.refinanceService.checkBankAccountValidity(control.value).pipe(
                map(res => {
                    if (typeof res === 'string') {
                        this.validationMessageBankAccount = res;
                        return { bankAccountInvalid: true };
                    } else {
                        return null;
                    }
                }),
            );
        };
    }

    setReferenceNumberValidator(i: number) {
        const referenceNumber = this.refRequestLoans().controls[i].get('paymentReferenceNumber');
        const paymentModel = this.refRequestLoans().controls[i].get('paymentModel');
        if (paymentModel?.value && referenceNumber?.value) {
            referenceNumber?.setAsyncValidators(this.referenceNumberValidator(paymentModel?.value));
            referenceNumber.updateValueAndValidity();
            referenceNumber?.clearAsyncValidators();
        }
    }

    referenceNumberValidator(paymentModel: string): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.refinanceService.checkReferenceNumberValidity(control.value, paymentModel).pipe(
                map(res => {
                    if (typeof res === 'string') {
                        this.validationMessageReferenceNumber = res;
                        return { referenceNumberInvalid: true };
                    } else {
                        return null;
                    }
                }),
            );
        };
    }

    checkValidators(i: number) {
        const externalId = this.refRequestLoans().controls[i].get('externalId');
        const amount = this.refRequestLoans().controls[i].get('amount');
        const contractDate = this.refRequestLoans().controls[i].get('contractDate');
        if (externalId?.value || (amount?.value && contractDate?.value && !this.isExternalIdRequired)) {
            externalId?.removeValidators(Validators.required);
            amount?.removeValidators(Validators.required);
            contractDate?.removeValidators(Validators.required);
        } else {
            externalId?.setValidators(Validators.required);
            amount?.setValidators(Validators.required);
            contractDate?.setValidators(Validators.required);
        }
        externalId?.updateValueAndValidity();
        amount?.updateValueAndValidity();
        contractDate?.updateValueAndValidity();
    }

    refRequestLoans(): FormArray {
        return this.refinanceForm.get('refRequestLoans') as FormArray;
    }

    //Add new loan to array
    addToArray() {
        this.refRequestLoans().push(this.newLoanRequest());
    }

    //Structure of new loan
    newLoanRequest(content?: any): FormGroup {
        return this.fb.group({
            externalId: [content?.externalId, Validators.required],
            amount: [content?.amount, Validators.required],
            contractDate: [content?.contractDate, Validators.required],
            loanTypeId: [content?.loanTypeId, Validators.required],
            debtAmount: [content?.debtAmount],
            debtDecreaseAmount: [content?.debtDecreaseAmount],
            debtFeeAmount: [content?.debtFeeAmount],
            debtTotalDecreaseAmount: [content?.debtTotalDecreaseAmount],
            debtTotalAmount: [content?.debtTotalAmount],
            previousBankAccount: [content?.previousBankAccount],
            paymentReferenceNumber: [content?.paymentReferenceNumber],
            paymentModel: [content?.paymentModel],
        });
    }

    //Remove loan by index
    removeLoan(i: number) {
        this.refRequestLoans().removeAt(i);
    }

    //Get banks
    getSearch(search: any, pageNumber: number, pageSize: number) {
        this.banksService.getSearch(search, pageNumber, pageSize, '', '').subscribe((res: IPage<IBankDTO>) => {
            this.banks = res.content;
            if (
                (!this.refinanceRequst && this.currentUser?.bank.id) ||
                (this.refinanceRequst && this.currentUser?.bank.id === this.refinanceRequst.newBank.id)
            ) {
                this.previousBanks = this.banks.filter(bank => bank.id !== this.currentUser?.bank.id);
            } else {
                this.previousBanks = res.content;
            }
            this.previousBanks.sort((a, b) => a.name.localeCompare(b.name));
        });
    }

    //Get loans
    getLoanSearch(search: any, pageNumber: number, pageSize: number) {
        this.refinanceService.searchLoanTypes(search, pageNumber, pageSize).subscribe((res: IPage<ILoanType>) => {
            this.loanTypes = res.content;
        });
    }

    getServerData($event: PageEvent) {
        this.getSearch(this.search, $event.pageIndex, this.pageSize);
    }

    showMessage(message: string) {
        this.snackBar.open(message);
    }

    setSearch(event: any) {
        this.search = event.target.value;
        this.getSearch(this.search, 0, this.pageSize);
    }

    // format date and amount before send request to BE
    parseRefRequestLoansData() {
        this.refinanceRequst = JSON.parse(JSON.stringify(this.refinanceForm.value));
        this.refinanceRequst.refRequestLoans.map(el => {
            if (el.contractDate) {
                el.contractDate = dayjs(el.contractDate).format('YYYY-MM-DD');
            }
            if (el.amount) {
                el.amount = this.convertAmountToNumber(el.amount);
            }
        });
    }

    createDraft() {
        this.refinanceForm.enable();
        this.isFormSubmitted = true;
        if (this.refinanceForm.valid) {
            this.refinanceRequst = this.refinanceForm.value;
            const documents: any = [];
            this.refinanceRequst.documents = this.refinanceRequst.documents.filter((el: any) => el.documentType === 'REQUEST');
            this.refinanceRequst.documents.map((el: any) => {
                documents.push(el.id);
            });
            this.refinanceRequst.documents = documents;
            this.parseRefRequestLoansData();

            if (this.id) {
                this.refinanceService.updateDraftRefloanRequest(this.refinanceRequst, this.id).subscribe({
                    next: res => {
                        this.translateService.showMessage('success_recorded');
                        this.router.navigate(['main/refinance-table']);
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
            } else {
                this.refinanceService.createDraft(this.refinanceRequst).subscribe({
                    next: res => {
                        this.translateService.showMessage('success_recorded');
                        this.router.navigate(['main/refinance-table']);
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
            }
        }
        this.refinanceForm.get('newBankId')?.disable();
    }

    createAndSubmit() {
        this.refinanceForm.enable();
        this.isFormSubmitted = true;
        if (this.refinanceForm.valid) {
            this.refinanceRequst = this.refinanceForm.value;

            this.parseRefRequestLoansData();
            if (this.id) {
                const documents: any = [];
                this.refinanceRequst.documents = this.refinanceRequst.documents.filter((el: any) => el.documentType === 'REQUEST');
                this.refinanceRequst.documents.map((el: any) => {
                    documents.push(el.id);
                });
                this.refinanceRequst.documents = documents;
                this.refinanceService.submitDraftRequest(this.refinanceRequst, this.id).subscribe({
                    next: res => {
                        this.translateService.showMessage('success_recorded');
                        this.router.navigate(['main/refinance-table']);
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
            } else {
                this.refinanceService.createAndSubmit(this.refinanceRequst).subscribe({
                    next: res => {
                        this.translateService.showMessage('success_recorded');
                        this.router.navigate(['main/refinance-table']);
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
            }
            this.refinanceForm.get('newBankId')?.disable();
        }
    }

    // Go back
    goBack() {
        this.router.navigate(['/main/refinance-table']);
    }

    refRequestDocuments(): FormArray {
        return this.refinanceForm.get('documents') as FormArray;
    }

    resetPreviousFile(event: any) {
        event.target.value = '';
    }

    onChange(event: any) {
        this.file = <File>event.target.files[0];
    }

    //Multiple file uploads
    selectFiles(event: any) {
        this.urls = [];
        this.switchButtonMode = false;
        let selectedFiles = event.target.files;
        if (selectedFiles) {
            for (let file of selectedFiles) {
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    this.urls.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
            for (let i = 0; i < selectedFiles.length; i++) {
                this.upload(selectedFiles[i]);
            }
        }
    }

    upload(file: File): void {
        if (file) {
            this.refinanceService.upload(file, this.type).subscribe({
                next: (event: any) => {
                    if (event instanceof HttpResponse) {
                        this.createDoc(event.body.id);
                        this.previewDoc(event.body);
                        this.showMessage('Datoteka je uspešno otpremljena: ' + file.name);
                    }
                },
                error: (err: any) => {
                    this.showMessage('Nije moguće otpremiti datoteku: ' + file.name);
                },
            });
        }
    }

    previewDoc(fileBody: any) {
        return this.refinanceRequestDocuments.push(fileBody);
    }

    //Pushing the files to the array
    createDoc(file: any) {
        const newFile = new FormControl(file);
        (<FormArray>this.refinanceForm.get('documents')).push(newFile);
    }

    switchDropButton() {
        this.switchButtonMode = !this.switchButtonMode;
    }

    actionFun(event: any, fileUpload: any) {
        this.type = event;
        fileUpload.click();
    }

    //Document action
    addDocumentAction() {
        setTimeout(() => {
            this.refinanceService.getListOfActions(this.addDocumentActionCode).subscribe((res: any) => {
                res.forEach((el: any) => {
                    this.clearIsTrue = el;
                    this.checkForDelete.push(el);

                    let actionName;

                    if (el == 'REQUEST') {
                        this.shiftLeft = true;
                        actionName = 'Zahtev za refinansiranje';
                    } else if (el == 'SUBSIDY_DEBT_INFO') {
                        this.shiftLeft = false;
                        actionName = 'Stanje za subvencionisane kredite';
                    } else if (el == 'LETTER_OF_INTENT') {
                        this.shiftLeft = false;
                        actionName = 'Pismo o namerama';
                    }

                    const actionObj = {
                        action: el,
                    };

                    this.documentActionArray.push(actionObj);

                    if (el) {
                        this.hideMenu = true;
                    } else {
                        this.hideMenu = false;
                    }
                });
            });
        }, 300);
    }

    //Download Docs
    download(doc: any): void {
        this.refinanceService.getDocs(doc.id).subscribe((blob: any) => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = doc.name;
            a.click();
            URL.revokeObjectURL(objectUrl);
        });
    }

    //File delete
    deleteDocs(i: number) {
        this.refinanceRequestDocuments.splice(i, 1);
        (<FormArray>this.refinanceForm.get('documents')).removeAt(i);
    }

    showLoanValidationMessage(controlName: string, index?: number): boolean {
        let control;

        if (index || index === 0) {
            control = this.refRequestLoans().controls[index]?.get(controlName);
        } else {
            control = this.refinanceForm?.get(controlName);
        }
        if (control && control.invalid && (control.touched || this.isFormSubmitted)) {
            return true;
        }
        return false;
    }

    calculateTotalAmount(i: number) {
        // debtTotalAmount = debtAmount - debtDecreaseAmount + debtFeeAmount
        let debtAmount = this.refRequestLoans().controls[i].get('debtAmount');
        let debtDecreaseAmount = this.refRequestLoans().controls[i].get('debtDecreaseAmount');
        let debtFeeAmount = this.refRequestLoans().controls[i].get('debtFeeAmount');
        let debtTotalAmount = this.refRequestLoans().controls[i].get('debtTotalAmount');

        if (debtAmount && debtAmount.value && debtDecreaseAmount && debtDecreaseAmount.value && debtFeeAmount && debtFeeAmount.value) {
            let total =
                this.convertAmountToNumber(debtAmount.value) -
                this.convertAmountToNumber(debtDecreaseAmount.value) +
                this.convertAmountToNumber(debtFeeAmount.value);
            debtTotalAmount?.setValue(total);
            this.formatAmount(i, 'debtTotalAmount');
        }
    }

    // format amounts before send request to BE
    parseDebtRequestModel(el: DebtRequestModel) {
        if (el.amount) {
            el.amount = this.convertAmountToNumber(el.amount);
        }
        if (el.debtAmount) {
            el.debtAmount = this.convertAmountToNumber(el.debtAmount);
        }
        if (el.debtDecreaseAmount) {
            el.debtDecreaseAmount = this.convertAmountToNumber(el.debtDecreaseAmount);
        }
        if (el.debtFeeAmount) {
            el.debtFeeAmount = this.convertAmountToNumber(el.debtFeeAmount);
        }
        if (el.debtTotalDecreaseAmount) {
            el.debtTotalDecreaseAmount = this.convertAmountToNumber(el.debtTotalDecreaseAmount);
        }
        if (el.debtTotalAmount) {
            el.debtTotalAmount = this.convertAmountToNumber(el.debtTotalAmount);
        }
    }

    sendDebtInfo() {
        const arr = this.refinanceRequestDocuments?.filter((el: any) => el.documentType !== 'REQUEST');
        arr.forEach((sm: any) => {
            this.sendDebtDocument.push(sm.id);
        });

        setTimeout(() => {
            this.isFormSubmitted = true;
            let debtRequestModel: DebtRequestModel = new DebtRequestModel();
            let debtInfoRequestModel: DebtInfoRequestModel = new DebtInfoRequestModel();
            this.refRequestLoans().controls.forEach((loans: any) => {
                loans.get('externalId').enable();
                loans.get('debtTotalAmount').enable();
                this.parseDebtRequestModel(loans.value);
                debtRequestModel = loans.value;
                debtInfoRequestModel.sendDebtInfoRequestItems.push(debtRequestModel);
            });
            if (this.sendDebtDocument.length > 0) {
                debtInfoRequestModel?.documents.push(...this.sendDebtDocument);
            }
            if (this.refinanceForm.valid) {
                this.refinanceService.sendDebtRequest(debtInfoRequestModel, this.id).subscribe({
                    next: res => {
                        this.translateService.showMessage('success_recorded');
                        this.router.navigate(['main/refinance-table']);
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
            }
            this.refinanceForm.disable();

            this.enableField();
        }, 300);
    }

    submitTrans() {
        this.isFormSubmitted = true;
        this.refinanceService.submitTrans(this.id).subscribe({
            next: res => {
                this.translateService.showMessage('success_recorded');
                this.router.navigate(['main/refinance-table']);
            },
            error: error => {
                error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    showLoanData() {
        return (
            !this.isUserBank &&
            (this.isSubmitted ||
                this.isStatusConfirmed ||
                this.isStatusDebtInfoSubmited ||
                this.isUserPrevBank ||
                this.isStatusTransSubmited ||
                this.isStatusTransCheckpending)
        );
    }

    confirmTransaction() {
        this.isFormSubmitted = true;
        this.refinanceService.confirmTransaction(this.id).subscribe({
            next: res => {
                this.translateService.showMessage('success_recorded');
                this.router.navigate(['main/refinance-table']);
            },
            error: error => {
                error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    updateTrans() {
        this.isFormSubmitted = true;
        this.refinanceService.updateTrans(this.id).subscribe({
            next: res => {
                this.translateService.showMessage('success_recorded');
                this.router.navigate(['main/refinance-table']);
            },
            error: error => {
                error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    cancel() {
        this.status = Reasons.CANCEL;
        this.url = RefinanceUrl.CANCEL;
        this.openDialog();
    }

    openDialog() {
        const status = this.status;
        const id = this.id;
        const dialogRef = this.dialog.open(InformationDialog, {
            width: '1000px',
            height: 'auto',
            data: { status: status, id: id, url: this.url },
            position: { top: '15%', left: '25%' },
        });
    }

    downLoadDebtInfoDocument(index: number) {
        this.refinanceService.downLoadDebtInfoDocument(this.id, index).subscribe(res => {
            const fileName = res.headers.get('content-disposition')?.split('=')[1] || 'Izveštaj.pdf';
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(res.body!);
            a.href = objectUrl;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(objectUrl);
        });
    }

    autofocusOnSearchInput() {
        this.searchField.nativeElement.focus();
    }
}
