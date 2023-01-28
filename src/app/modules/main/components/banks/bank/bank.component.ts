import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BanksService } from 'src/app/services/banks.service';
import { BankData, IBankData, IBankDTO, IBankEmailDomain } from 'src/app/models/bank.model';
import { TranslateService } from 'src/app/services/translate.service';
import { validatorsPattern } from 'src/app/utils/validators-pattern';
import { LANG_SR_TRANS } from 'src/app/utils/sr-Latin';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-bank',
    templateUrl: './bank.component.html',
    styleUrls: ['./bank.component.scss'],
})
export class BankComponent implements OnInit {
    bankForm: FormGroup;
    newBank: BankData = new BankData('', '', '', '', '', '', [], false);
    singleBank: IBankDTO;
    item: IBankData;
    id: number;
    title: string = '';
    isFormSubmitted: boolean = false;
    userRole: any;

    emailDom: any[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private banksService: BanksService,
        private fb: FormBuilder,
        private translateService: TranslateService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];

        if (this.id) {
            this.title = `#${this.id}`;
            this.bankById();
        } else {
            this.title = 'Kreiraj Novu Banku';
        }

        this.bankForm = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            shortName: ['', Validators.required],
            notificationMail: ['', Validators.pattern(validatorsPattern.EMAIL)],
            complainsMail: ['', Validators.pattern(validatorsPattern.EMAIL)],
            complainsUrl: ['', Validators.pattern(validatorsPattern.URL)],
            bankEmailDomains: new FormArray([]),
            active: [false],
        });

        this.getRole();

        this.bankForm.get('bankEmailDomains')?.valueChanges.subscribe(res => {
            // console.log(res);
        });
    }

    //Get bank email domains
    getDomain(): FormArray {
        return this.bankForm.get('bankEmailDomains') as FormArray;
    }

    //Add to array
    addDomainsToArray() {
        this.getDomain().push(new FormControl(null, [Validators.pattern(validatorsPattern.DOMAIN)]));
    }

    get bankEmailDomains(): FormArray {
        return this.bankForm.get('bankEmailDomains') as FormArray;
    }

    //Remove email domain
    removeLoan(i: number) {
        this.getDomain().removeAt(i);
    }

    // Get bank by id
    bankById() {
        this.banksService.getBankId(this.id).subscribe({
            next: res => {
                this.setBankForm(res);
                this.setDomains();
            },
            error: errorMessage => {
                this.router.navigate(['/main/banks'], { state: { editOrAddNewMode: true } });
                this.translateService.showMessage(errorMessage);
            },
        });
    }

    setBankForm(res: any) {
        this.singleBank = res;
        this.bankForm.patchValue(res);
    }

    setDomains() {
        this.singleBank.bankEmailDomains.forEach((data: any) => {
            const emailDomain = data.emailDomain;
            this.getDomain().push(new FormControl(emailDomain));
        });
    }

    onSubmit() {
        if (this.id) {
            this.updateBank();
        } else {
            this.createNewBank();
        }
    }

    // Update bank
    updateBank() {
        this.singleBank = { ...this.singleBank, ...this.bankForm.value };
        this.isFormSubmitted = true;

        if (this.bankForm.valid) {
            this.banksService.updateBank(this.bankForm.value, this.singleBank.id).subscribe({
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

    // Create new bank
    createNewBank() {
        this.newBank = this.bankForm.value;
        this.isFormSubmitted = true;

        if (this.bankForm.valid) {
            this.banksService.postBank(this.newBank).subscribe({
                next: (res: any) => {
                    this.translateService.showMessage('success_created');
                    this.bankForm.reset();
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

    // Go back
    goBack() {
        this.router.navigate(['/main/banks'], { state: { editOrAddNewMode: true } });
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.bankForm.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }

    getRole() {
        this.userService.getUserDetails().subscribe({
            next: res => {
                this.userRole = res.roles;
            },
        });
    }
}
