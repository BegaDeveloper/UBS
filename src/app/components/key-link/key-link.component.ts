import { Component, ComponentFactoryResolver, Input, OnInit } from '@angular/core';
import { PasswordConfigModel } from '../../models/password-config.model';
import { ActivateUserRequest, DataChangePassword, IUserDTO } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ForgotPasswordRequest } from '../../models/forgot-password-reset.model';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
    selector: 'app-key-link',
    templateUrl: './key-link.component.html',
    styleUrls: ['./key-link.component.scss'],
})
export class KeyLinkComponent implements OnInit {
    @Input() isPasswordReset = false;
    @Input() isUserActivation = false;
    @Input() isPasswordChange = false;
    @Input() title: string;
    @Input() btnText: string;
    passwordPattern: PasswordConfigModel;
    newForm: FormGroup;
    isKeyValid: boolean;
    userDto: IUserDTO;
    activateUserRequest: ActivateUserRequest;
    forgotPasswordRequest: ForgotPasswordRequest = new ForgotPasswordRequest();
    changePasswordData: DataChangePassword = new DataChangePassword('', '');
    isFormSubmitted: boolean = false;
    isPasswordVisible: boolean[] = [false, false, false];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private userService: UserService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.getResolvedData();
        this.createForm();
        if (this.isUserActivation || this.isPasswordReset) {
            this.getKey();
            this.newForm.get("oldPassword")?.disable();
        }
    }

    getKey() {
        let url = '';
        if (this.isUserActivation) {
            url = 'users/activation-key/';
        } 
        if (this.isPasswordReset) {
            url = 'users/reset-key/';
        }

        this.activatedRoute.queryParams.subscribe(params => {
            this.userService.getUserByKey(params['key'], url).subscribe({
                next: res => {
                    this.userDto = res;
                    this.isKeyValid = true;
                },
                error: error => {
                    this.isKeyValid = false;
                },
            });
        });
    }

    getResolvedData() {
        this.passwordPattern = this.activatedRoute.snapshot.data['passwordConfig'];
    }

    createForm() {
        this.newForm = this.fb.group({
            login: [{ value: this.userDto?.login, disabled: true }],
            oldPassword: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.pattern(this.passwordPattern?.regex)]],
            repeatedPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern?.regex)]],
            key: [''],
        });
    }

    checkPasswords(formValues: any) {
        if (formValues.password !== formValues.repeatedPassword) {
            this.translateService.showMessage('password_mismatch');
            return false;
        }
        return true;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        const formValues = this.newForm.value;

        if (this.newForm.valid) {
            if (this.checkPasswords(formValues)) {
                if (this.isPasswordChange) {
                    this.changePassword();
                } else if (this.isPasswordReset) {
                    this.forgotPasswordRequest.resetKey = this.userDto?.resetKey;
                    this.forgotPasswordRequest.password = formValues.password;
                    this.userService.resetPassword(this.forgotPasswordRequest).subscribe({
                        next: response => {
                            this.translateService.showMessage('success_password_reset');
                            this.goToLogin();
                        },
                        error: error => {
                            error.appCode
                                ? this.translateService.showMessage(error.appCode)
                                : this.translateService.showMessage('SERVER_ERROR');
                        },
                    });
                } else if (this.isUserActivation) {
                    this.activateUserRequest = new ActivateUserRequest();
                    this.activateUserRequest.activationKey = this.userDto?.activationKey;
                    this.activateUserRequest.password = formValues.password;
                    this.userService.activateUser(this.activateUserRequest).subscribe({
                        next: response => {
                            this.translateService.showMessage('success_activation');
                            this.goToLogin();
                        },
                        error: error => {
                            error.appCode
                                ? this.translateService.showMessage(error.appCode)
                                : this.translateService.showMessage('SERVER_ERROR');
                        },
                    });
                }
            }
        } else {
            return;
        }
    }

    changePassword() {
        this.changePasswordData.oldPassword = this.newForm.value.oldPassword;
        this.changePasswordData.newPassword = this.newForm.value.password;

        this.userService.changePassword(this.changePasswordData).subscribe({
            next: res => {
                this.translateService.showMessage('success_password_reset');
                this.goToDashboard();
            },
            error: error => {
                error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
            },
        });
    }

    goToDashboard() {
        this.router.navigate(['/main']);
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.newForm.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }

    togglePasswordVisibility(index: number) {
        this.isPasswordVisible[index] = !this.isPasswordVisible[index];
    }
}
