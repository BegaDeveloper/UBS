import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ILoanType, LoanData } from 'src/app/models/loan-type.model';
import { LoanTypeService } from 'src/app/services/loan-type.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
    selector: 'app-loan-type',
    templateUrl: './loan-type.component.html',
    styleUrls: ['./loan-type.component.scss'],
})
export class LoanTypeComponent implements OnInit {
    loanForm: FormGroup;
    newLoan: LoanData = new LoanData('', '', '');
    loan: ILoanType;
    id: number;
    title: string = '';
    isFormSubmitted: boolean = false;
    allLoans: any;
    catTypes: Array<any> = [
        { name: 'Kredit', code: 'CREDIT' },
        { name: 'Dozvoljeno prekoračenje', code: 'OVERDRAFT' },
        { name: 'Kreditna kartica', code: 'CREDIT_CARD' },
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private loanTypeService: LoanTypeService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];

        if (this.id) {
            this.title = `#${this.id}`;
            this.loanById();
        } else {
            this.title = 'Kreiraj novi tip kredita';
        }

        this.loanForm = this.fb.group({
            code: ['', Validators.required],
            categoryType: ['', Validators.required],
            name: ['', Validators.required],
        });
    }

    //Get Loan by id
    loanById() {
        this.loanTypeService.getLoanById(this.id).subscribe({
            next: res => {
                this.loan = res;
                this.loanForm.patchValue(res);
            },
            error: errorMessage => {
                this.router.navigate(['/main/loan-types'], { state: { editOrAddNewMode: true } });
                this.translateService.showMessage(errorMessage);
            },
        });
    }

    onSubmit() {
        if (this.id) {
            this.updateLoan();
        } else {
            this.createNewLoan();
        }
    }

    //Update loan
    updateLoan() {
        this.loan.code = this.loanForm.value.code;
        this.loan.name = this.loanForm.value.name;
        this.isFormSubmitted = true;

        if (this.loanForm.valid) {
            this.loanTypeService.updateLoan(this.loanForm.value, this.loan.id).subscribe({
                next: (res: any) => {
                    this.translateService.showMessage('success_edited');
                    this.goBack();
                },
                error: error => {
                    error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
                },
            });
        } else {
            return;
        }
    }

    // Create new loan
    createNewLoan() {
        this.newLoan.name = this.loanForm.value.name;
        this.newLoan.categoryType = this.loanForm.value.categoryType;
        this.newLoan.code = this.loanForm.value.code;
        this.isFormSubmitted = true;

        if (this.loanForm.valid) {
            this.loanTypeService.postNewLoan(this.newLoan).subscribe({
                next: (res: any) => {
                    this.translateService.showMessage('success_created');
                    this.loanForm.reset();
                    this.goBack();
                },
                error: error => {
                    error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
                },
            });
        } else {
            return;
        }
    }

    //Go back
    goBack() {
        this.router.navigate(['/main/loan-types'], { state: { editOrAddNewMode: true } });
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.loanForm.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }
}
