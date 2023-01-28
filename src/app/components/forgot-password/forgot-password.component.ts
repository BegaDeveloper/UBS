import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate.service';
import { validatorsPattern } from 'src/app/utils/validators-pattern';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    formGroup: FormGroup;
    isFormSubmitted: boolean = false;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private userService: UserService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.createForm();
    }

    createForm() {
        this.formGroup = this.fb.group({
            email: ['', [Validators.required, Validators.pattern(validatorsPattern.EMAIL)]],
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        const email = this.formGroup.get('email')?.value;
        if (this.formGroup.valid) {
            this.userService.getForgotPasswordLink(email).subscribe(
                response => {
                    this.translateService.showMessage('success_sent');
                    this.goToLogin();
                },
                error => {
                    error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
                },
            );
        } else {
            return;
        }
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.formGroup.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
