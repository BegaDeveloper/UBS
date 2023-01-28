import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '../../services/translate.service';
import { Components } from '../../utils/enums';
import { BanksService } from '../../services/banks.service';
import { UserService } from '../../services/user.service';
import { HolidayService } from 'src/app/services/holiday.service';
import { LoanTypeService } from 'src/app/services/loan-type.service';
import { ApplicationService } from 'src/app/services/application.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
    component: string;
    id: number;

    constructor(
        public dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private banksService: BanksService,
        private userService: UserService,
        private holidayService: HolidayService,
        private loanTypeService: LoanTypeService,
        private translateService: TranslateService,
        private appService: ApplicationService,
        private messageService: MessagesService,
    ) {
        this.component = data.component;
        this.id = data.id;
    }

    ngOnInit(): void {}

    deleteRow() {
        switch (this.component) {
            case Components.BANK:
                this.banksService.deleteBank(this.id).subscribe({
                    next: () => {
                        this.doAction();
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
                break;
            case Components.USER:
                this.userService.deleteUser(this.id).subscribe({
                    next: () => {
                        this.doAction();
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
                break;
            case Components.HOLIDAY:
                this.holidayService.deleteHoliday(this.id).subscribe({
                    next: () => {
                        this.doAction();
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
                break;
            case Components.LOAN:
                this.loanTypeService.deleteLoan(this.id).subscribe({
                    next: () => {
                        this.doAction();
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
                break;
            case Components.APPLICATIONS:
                this.appService.deleteApp(this.id).subscribe({
                    next: () => {
                        this.doAction();
                    },
                    error: error => {
                        error.appCode
                            ? this.translateService.showMessage(error.appCode)
                            : this.translateService.showMessage('SERVER_ERROR');
                    },
                });
                break;
            case Components.MESSAGE:
                this.messageService.deleteMessageTemplate(this.id).subscribe({
                    next: () => {
                        this.doAction();
                    },
                });
        }
    }

    doAction() {
        this.dialogRef.close({ event: 'delete' });
    }
}
