import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewActivationLink, NewUser, NewUserData, UnlockData } from 'src/app/models/user.model';
import { BanksService } from 'src/app/services/banks.service';
import { TranslateService } from 'src/app/services/translate.service';
import { UserService } from 'src/app/services/user.service';
import { validatorsPattern } from 'src/app/utils/validators-pattern';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-user-action',
    templateUrl: './user-action.component.html',
    styleUrls: ['./user-action.component.scss'],
})
export class UserActionComponent implements OnInit, AfterViewInit {
    userForm: FormGroup;
    unlockForm: FormGroup;
    userRole: any;
    banks: any = [];
    currentBank: string;
    bankId: number;
    bankName: string;
    id: number;
    singleUser: any;
    title: string;
    matcher = new MyErrorStateMatcher();
    newUser: NewUserData = new NewUserData(0, '', '', '', [], false);
    activationKey: NewActivationLink = new NewActivationLink('');
    unlockModel: UnlockData = new UnlockData(false);
    activeOrNot: string;
    activationForm: FormGroup;
    isFormSubmitted: boolean = false;
    enableBox: boolean;
    unlockTitle: string;
    roleTypes: Array<any> = [];
    queryParam: any;
    disableField: boolean = false;
    disableCheckbox: boolean = false;
    checkTheBox: boolean = true;
    unCheck: boolean = true;

    constructor(
        private fb: FormBuilder,
        public router: Router,
        private userService: UserService,
        private banksService: BanksService,
        private route: ActivatedRoute,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.userForm = this.fb.group({
            bankId: ['', Validators.required],
            login: ['', [Validators.pattern(validatorsPattern.EMAIL)]],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            roles: this.fb.array([]),
            enabled: [true],
        });

        this.id = this.route.snapshot.params['id'];

        if (this.id) {
            this.title = `#${this.id}`;
            this.getUser();
        } else {
            this.title = 'Kreiraj novog korisnika';
        }

        this.getRole();

        this.activationForm = this.fb.group({
            activationKey: [''],
        });

        this.unlockForm = this.fb.group({
            locked: [false],
        });

        this.route.queryParams.subscribe(params => {
            this.queryParam = params['/edit-user/' + this.id];
        });
    }

    ngAfterViewInit() {}

    onCheckBoxChange(e: MatCheckboxChange, roleType: any, check: any) {
        for (var i = 0; i < this.roleTypes.length; i++) {
            this.roleTypes[i].isChecked = !e.checked;

            if (roleType.role == 'SUPERADMIN' && e.checked) {
                this.disableCheckbox = true;
                this.unCheck = false;
                if (roleType.role !== 'SUPERADMIN' && e.checked) {
                    e.checked = false;
                }
            } else {
                this.disableCheckbox = false;
                this.unCheck = true;
            }
        }

        if (roleType.role == 'SUPERADMIN' && e.checked == true) {
            this.disableField = true;
            if (roleType.role == 'ADMIN' && e.checked == true) {
                e.checked = false;
            }
        } else {
            this.disableField = false;
        }

        if (e.checked) {
            this.roles.push(new FormControl(e.source.value));

            if (this.roles.value.includes('SUPERADMIN')) {
                const arr = this.roles.value;

                arr.forEach((el: any, index: number) => {
                    if (el !== 'SUPERADMIN') delete arr[index];
                });

                this.userForm.controls['bankId']?.reset();

                this.banks = [];
            }
        } else {
            this.getBanks();
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

        this.singleUser?.roles?.forEach((role: any) => {
            if (roleType == role) {
                isChecked = true;
            }
        });

        return isChecked;
    }

    get roles(): FormArray {
        return this.userForm.get('roles') as FormArray;
    }

    //Go back
    goBack() {
        this.router.navigate(['/main/users'], { state: { editOrAddNewMode: true } });
    }

    adminArray() {
        return (this.roleTypes = [
            { name: 'Super admin', role: 'SUPERADMIN', isChecked: this.checkTheBox },
            { name: 'Admin', role: 'ADMIN', isChecked: this.checkTheBox },
            { name: 'Operator nove banke', role: 'OPERATOR_NEW', isChecked: this.checkTheBox },
            { name: 'Operator prethodne banke', role: 'OPERATOR_PREV', isChecked: this.checkTheBox },
        ]);
    }

    getRole() {
        this.userService.getUserDetails().subscribe({
            next: res => {
                this.userRole = res.roles;

                if (this.userRole.includes('ADMIN')) {
                    this.bankName = res.bank.name;
                    this.userForm.patchValue({
                        bankId: res.bank.id,
                    });
                    this.roleTypes = [
                        { name: 'Admin', role: 'ADMIN' },
                        { name: 'Operator nove banke', role: 'OPERATOR_NEW' },
                        { name: 'Operator prethodne banke', role: 'OPERATOR_PREV' },
                    ];
                } else if (this.userRole.includes('SUPERADMIN')) {
                    this.getBanks();
                    this.roleTypes = [
                        { name: 'Super admin', role: 'SUPERADMIN', isChecked: true },
                        { name: 'Admin', role: 'ADMIN', isChecked: true },
                        { name: 'Operator nove banke', role: 'OPERATOR_NEW', isChecked: true },
                        { name: 'Operator prethodne banke', role: 'OPERATOR_PREV', isChecked: true },
                    ];
                }
            },
        });
    }

    //Get all banks
    getBanks() {
        this.banksService.getAllBanks().subscribe(res => {
            this.banks = res;
        });
    }

    //Get user by id
    getUser() {
        this.userService.getUserId(this.id).subscribe({
            next: (res: any) => {
                this.userForm.patchValue({
                    bankId: res.bank ? res.bank.id : '',
                    login: res.login,
                    firstName: res.firstName,
                    lastName: res.lastName,
                    enabled: res.enabled,
                });

                this.singleUser = res;

                if (this.singleUser?.roles) {
                    this.singleUser.roles.forEach((role: any) => {
                        this.roles.push(new FormControl(role));
                    });
                }

                if (this.singleUser.active == true) {
                    this.activeOrNot = 'Korisnik je aktivan';
                } else {
                    this.activeOrNot = 'Korisnik nije aktivan';
                }

                if (this.singleUser.locked == false) {
                    this.unlockTitle = 'Korisnik nije zaključan';
                } else {
                    this.unlockTitle = 'Korisnik je zaključan';
                }
            },
            error: errorMessage => {
                this.router.navigate(['/main/users'], { state: { editOrAddNewMode: true } });
                this.translateService.showMessage(errorMessage);
            },
        });
    }

    //Update bank
    update() {
        this.isFormSubmitted = true;

        if (this.userForm.value.roles.length === 1 && this.userForm.value.roles.includes('SUPERADMIN')) {
            this.userForm.get('bankId')?.removeValidators(Validators.required);
            this.userForm.get('bankId')?.updateValueAndValidity();
        } else {
            this.userForm.get('bankId')?.setValidators(Validators.required);
            this.userForm.get('bankId')?.updateValueAndValidity();
        }

        if (this.userForm.valid) {
            this.userService.updateUser(this.userForm.value, this.singleUser.id).subscribe({
                next: (res: NewUser) => {
                    this.translateService.showMessage('success_edited');
                    this.goBack();
                },
                error: errorMessage => {
                    errorMessage.appCode
                        ? this.translateService.showMessage(errorMessage.appCode)
                        : this.translateService.showMessage('SERVER_ERROR');
                },
            });
        } else {
            return;
        }
    }

    //Post new user
    postUser() {
        this.newUser = this.userForm.value;

        if (this.newUser.roles.length === 1 && this.newUser.roles.includes('SUPERADMIN')) {
            this.userForm.get('bankId')?.removeValidators(Validators.required);
            this.userForm.get('bankId')?.updateValueAndValidity();
        } else {
            this.userForm.get('bankId')?.setValidators(Validators.required);
            this.userForm.get('bankId')?.updateValueAndValidity();
        }

        this.isFormSubmitted = true;

        if (this.userForm.valid) {
            this.userService.postNewUser(this.newUser).subscribe({
                next: res => {
                    this.translateService.showMessage('success_created');
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

    //Send activation link
    sendLink() {
        this.activationKey = this.activationForm.value.activationKey;

        this.userService.sendActivationLink(this.singleUser.id, this.activationKey).subscribe({
            next: res => {
                this.translateService.showMessage('success_activation_link');
            },
            error: errorMessage => {
                errorMessage.appCode
                    ? this.translateService.showMessage(errorMessage.appCode)
                    : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    //Unlock user
    unlock() {
        this.unlockModel.locked = this.unlockForm.value.locked;

        this.userService.unlockUser(this.singleUser.id, this.unlockModel).subscribe({
            next: res => {
                this.translateService.showMessage('success_unlocked');
                this.singleUser.locked = false;
            },
            error: errorMessage => {
                errorMessage.appCode
                    ? this.translateService.showMessage(errorMessage.appCode)
                    : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    onSubmit() {
        if (this.id) {
            this.update();
        } else {
            this.postUser();
        }
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.userForm.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }
}
