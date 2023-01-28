import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateService } from 'src/app/services/translate.service';
import * as dayjs from 'dayjs';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
    reportsForm: FormGroup;
    isFormSubmitted: boolean = false;
    reportBtn: boolean = false;
    userRole: any;

    constructor(
        private fb: FormBuilder,
        private reportsService: ReportsService,
        private translateService: TranslateService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.reportsForm = this.fb.group({
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            reportType: ['1'],
        });

        this.getRole();
    }

    changeRadio(event: any) {
        if (event.value == '1') {
            this.reportBtn = false;
        } else if (event.value == '2') {
            this.reportBtn = false;
        } else if (event.value == '3') {
            this.reportBtn = true;
        } else if (event.value == '4') {
            this.reportBtn = true;
        }
    }

    getRole() {
        this.userService.getUserDetails().subscribe({
            next: res => {
                this.userRole = res.roles;
            },
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        const startDateFormatted = dayjs(this.reportsForm.value.startDate).format('YYYY-MM-DD') + 'T00:00:00';
        const endDateFormatted = dayjs(this.reportsForm.value.endDate).format('YYYY-MM-DD') + 'T23:59:59.999';
        const reportType = this.reportsForm.value.reportType;

        if (this.reportsForm.valid) {
            this.reportsService.downloadReport(startDateFormatted, endDateFormatted, reportType).subscribe({
                next: response => {
                    const fileName = response.headers.get('content-disposition')?.split('=')[1] || 'Izveštaj.pdf';
                    const a = document.createElement('a');
                    const objectUrl = URL.createObjectURL(response.body!);
                    a.href = objectUrl;
                    a.download = fileName;
                    a.click();
                    URL.revokeObjectURL(objectUrl);
                },
                error: error => {
                    error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
                },
            });
        } else {
            return;
        }
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.reportsForm.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }
}
