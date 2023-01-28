import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

@Component({
    selector: 'app-api-key',
    templateUrl: './api-key.component.html',
    styleUrls: ['./api-key.component.scss'],
})
export class ApiKeyComponent implements OnInit {
    apiKey: string;
    privateKey: string;
    name: string;
    title: string = '';

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private clipboard: Clipboard,
        private router: Router,
        public dialogRef: MatDialogRef<ApiKeyComponent>,
    ) {
        this.apiKey = data?.apiKey;
        this.privateKey = data?.privateKey;
        this.name = data?.name;
    }

    ngOnInit(): void {
        if (this.router.url == '/main/add-application') {
            this.title = 'Aplikacija uspešno kreirana';
        } else {
            this.title = 'Aplikacija uspešno izmenjena';
        }
    }

    copyApiKey() {
        this.clipboard.copy(this.apiKey);
    }

    copyPrivateKey() {
        this.clipboard.copy(this.privateKey);
    }

    goBack() {
        this.router.navigate(['/main/applications']);
        this.dialogRef.close();
    }
}
