import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ApplicationData, ApplicationDTO } from 'src/app/models/applications.model';
import { ApplicationService } from 'src/app/services/application.service';
import { BanksService } from 'src/app/services/banks.service';
import { TranslateService } from 'src/app/services/translate.service';

import { ApiKeyComponent } from './api-key/api-key.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-app-action',
    templateUrl: './app-action.component.html',
    styleUrls: ['./app-action.component.scss'],
})
export class AppActionComponent implements OnInit {
    appForm: FormGroup;
    newApp: ApplicationData = new ApplicationData('', 0, []);
    singleApp: ApplicationDTO;
    title: string;
    isFormSubmitted: boolean = false;
    banks: any = [];
    matcher = new MyErrorStateMatcher();
    roleTypes: Array<any> = [
        { name: 'Admin', role: 'ADMIN' },
        { name: 'Operator nove banke', role: 'OPERATOR_NEW' },
        { name: 'Operator prethodne banke', role: 'OPERATOR_PREV' },
    ];
    apiKey: string;
    privateKey: string;
    openModal: boolean = false;
    id: number;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private banksService: BanksService,
        private translateService: TranslateService,
        private appService: ApplicationService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];

        if (this.id) {
            this.title = `#${this.id}`;
            this.getAppId();
        } else {
            this.getBanks();
            this.title = 'Kreiraj Novu Aplikaciju';
        }

        this.appForm = this.fb.group({
            name: ['', Validators.required],
            bankId: ['', Validators.required],
            roles: this.fb.array([]),
        });
    }

    onCheckBoxChange(e: any) {
        if (e.checked) {
            this.roles.push(new FormControl(e.source.value));
        } else {
            this.roles.controls.filter((item: any, index: number) => {
                if (item.value == e.source.value) {
                    this.roles.removeAt(index);
                    return;
                }
            });
        }
    }

    isRoleChecked(roleType: string) {
        let isChecked = false;
        this.singleApp?.roles?.forEach((role: any) => {
            if (roleType == role) {
                isChecked = true;
            }
        });
        return isChecked;
    }

    get roles(): FormArray {
        return this.appForm.get('roles') as FormArray;
    }

    //Go back
    goBack() {
        this.router.navigate(['/main/applications'], { state: { editOrAddNewMode: true } });
    }

    openDialogApi(res: any) {
        this.dialog.open(ApiKeyComponent, {
            width: '650px',
            height: '515px',
            data: {
                name: res.name,
                apiKey: res.apiKey,
                privateKey: res.privateKey,
            },
        });
    }

    updateApplication() {
        this.singleApp = { ...this.singleApp, ...this.appForm.value };
        this.isFormSubmitted = true;

        if (this.appForm.valid) {
            this.appService.updateApp(this.singleApp.id, this.appForm.value).subscribe({
                next: res => {
                    this.translateService.showMessage('success_edited');
                    this.openDialogApi(res);
                },
                error: error => {
                    error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
                },
            });
        } else {
            return;
        }
    }

    postApplication() {
        this.newApp = this.appForm.value;
        this.isFormSubmitted = true;

        if (this.appForm.valid) {
            this.appService.postApp(this.newApp).subscribe({
                next: (res: any) => {
                    this.openModal = true;
                    this.openDialogApi(res);
                },
                error: error => {
                    error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
                },
            });
        } else {
            return;
        }
    }

    onSubmit() {
        if (this.id) {
            this.updateApplication();
        } else {
            this.postApplication();
        }
    }

    //Get application by id
    getAppId() {
        this.appService.getAppById(this.id).subscribe({
            next: (res: any) => {
                this.apiKey = res.apiKey;
                this.setDataPut(res);
                this.appForm.patchValue({
                    bankId: res.bank.id,
                });
            },
            error: error => {
                error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    setDataPut(res: any) {
        this.singleApp = res;
        this.appForm.patchValue(res);

        if (this.singleApp?.roles) {
            this.singleApp.roles.forEach((role: any) => {
                this.roles.push(new FormControl(role));
            });
        }
    }

    //Get all banks
    getBanks() {
        this.banksService.getAllBanks().subscribe(res => {
            this.banks = res;

            this.appForm.patchValue({
                bankId: this.banks.id,
            });
        });
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.appForm.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }
}
