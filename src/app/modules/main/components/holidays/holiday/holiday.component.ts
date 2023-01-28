import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HolidayData, HolidayDTO } from 'src/app/models/holiday.model';
import { HolidayService } from 'src/app/services/holiday.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
    selector: 'app-holiday',
    templateUrl: './holiday.component.html',
    styleUrls: ['./holiday.component.scss'],
})
export class HolidayComponent implements OnInit {
    holidayForm: FormGroup;
    holidayModel: HolidayData = new HolidayData(0, 0, 0, 0, '');
    singleHoliday: HolidayDTO;
    id: number;
    title: string = '';
    isFormSubmitted: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private holidayService: HolidayService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];

        if (this.id) {
            this.title = `#${this.id}`;
            this.holidayById();
        } else {
            this.title = 'Dodaj praznik';
        }

        this.holidayForm = this.fb.group({
            name: ['', Validators.required],
            day: ['', Validators.required],
            month: ['', Validators.required],
            startYear: ['', Validators.required],
            endYear: ['', Validators.required],
        });
    }

    onSubmit() {
        if (this.id) {
            this.updateHoliday();
        } else {
            this.createNewHoliday();
        }
    }

    //Get holiday by id
    holidayById() {
        this.holidayService.getHolidayId(this.id).subscribe({
            next: res => {
                this.singleHoliday = res;
                this.holidayForm.patchValue(res);
            },
            error: errorMessage => {
                this.router.navigate(['/main/holidays'], { state: { editOrAddNewMode: true } });
                this.translateService.showMessage(errorMessage);
            },
        });
    }

    // Update holiday
    updateHoliday() {
        this.singleHoliday = { ...this.singleHoliday, ...this.holidayForm.value };
        this.isFormSubmitted = true;

        if (this.holidayForm.valid) {
            this.holidayService.update(this.singleHoliday.id, this.holidayForm.value).subscribe({
                next: response => {
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

    // Create new holiday
    createNewHoliday() {
        this.holidayModel = this.holidayForm.value;
        this.isFormSubmitted = true;

        if (this.holidayForm.valid) {
            this.holidayService.postHoliday(this.holidayModel).subscribe({
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

    // Go back
    goBack() {
        this.router.navigate(['/main/holidays'], { state: { editOrAddNewMode: true } });
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.holidayForm.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }
}
