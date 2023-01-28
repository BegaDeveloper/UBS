import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BanksService } from '../../services/banks.service';
import { UserService } from '../../services/user.service';
import { TranslateService } from '../../services/translate.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { RefinanceService } from '../../services/refinance.service';
import { Statuses } from '../../utils/enums';
import { RefinanceReasonModel } from '../../models/refinance-reason.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-information-dialog',
    templateUrl: './information-dialog.html',
    styleUrls: ['./information-dialog.scss'],
})
export class InformationDialog implements OnInit {
    formGroup: FormGroup;
    id: number;
    status: string;
    reasonList: RefinanceReasonModel[];
    url: string;
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private refinanceService: RefinanceService,
        private translateService: TranslateService,
        private router: Router,
    ) {
        this.id = data.id;
        this.status = data.status;
        this.url = data.url;
    }

    ngOnInit(): void {
        this.createForm();
        this.getReasons();
    }

    createForm() {
        this.formGroup = this.fb.group({
            reasonCode: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    getReasons() {
        this.refinanceService.getRequestReasons(this.status).subscribe(reasons => {
            this.reasonList = reasons;
        });
    }
    sendRequest() {
        this.refinanceService.sendRefinanceReason(this.id, this.formGroup.value, this.url).subscribe(res => {
            this.translateService.showMessage('success_recorded');
            this.router.navigate(['main/refinance-table']);
            this.dialogRef.close();
        });
    }

    onCloseClick() {
        this.dialogRef.close();
    }
}
