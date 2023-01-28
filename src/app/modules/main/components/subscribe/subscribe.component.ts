import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RootObject, SubscriptionRequestPut } from 'src/app/models/subs.model';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
    selector: 'app-subscribe',
    templateUrl: './subscribe.component.html',
    styleUrls: ['./subscribe.component.scss'],
})
export class SubscribeComponent implements OnInit {
    title: string = 'Podesavanje notifikacija';
    subForm: FormGroup;
    subs: RootObject[];
    displayedColumns: string[] = ['element', 'APP', 'EMAIL'];
    subsData: SubscriptionRequestPut = new SubscriptionRequestPut([]);

    putForm: FormGroup;
    codeName: string;

    constructor(
        private fb: FormBuilder,
        private subsService: SubscriptionsService,
        private location: Location,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.displaySubData();

        this.subForm = this.fb.group({
            subscriptionRequestItems: this.fb.array([this.addSubFormGroup()]),
        });
    }

    onChange(event: any, someVal: string, code: string) {
        const arrOb = this.subForm.get('subscriptionRequestItems')?.value;
        const subOb = this.subscriptionRequestItems()?.value;

        subOb.forEach((el: any) => {
            el.action = code;
            el.notificationChannel = someVal;
            el.subscribed = event.checked;

            this.subsData = this.subForm.value;

            this.subsService.updateSubs(this.subsData).subscribe({
                next: res => {
                    this.translateService.showMessage('success_recorded');
                },
                error: error => {
                    error.appCode ? this.translateService.showMessage(error.appCode) : this.translateService.showMessage('SERVER_ERROR');
                },
            });
        });
    }

    addSubFormGroup(): FormGroup {
        return this.fb.group({
            action: [''],
            notificationChannel: [''],
            subscribed: [false],
        });
    }

    subscriptionRequestItems() {
        return this.subForm.get('subscriptionRequestItems') as FormArray;
    }

    displaySubData() {
        this.subsService.getSubs().subscribe((res: any) => {
            this.subs = res.refActionSubscriptionResponseItemList;
            setTimeout(() => {
                this.subs?.forEach((e: any) => {
                    this.codeName = e.refAction.code;
                });
            });
        });
    }

    backToLastPage() {
        this.location.back();
    }
}
