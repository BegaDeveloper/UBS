import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Actions, MessageTemplateDTO } from 'src/app/models/messages.model';
import { MessagesService } from 'src/app/services/messages.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
    messageForm: FormGroup;
    messageModel: Actions = new Actions([], '', '', '');
    singleMessage: MessageTemplateDTO;
    id: number;
    title: string = '';
    isFormSubmitted: boolean = false;
    actionData: any;
    clearAction: boolean = false;
    notificationChannels: Array<any> = [{ channel: 'APP' }, { channel: 'EMAIL' }];
    getNumberOfActions: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private messageService: MessagesService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.getListOfActions();
        this.id = this.route.snapshot.params['id'];

        if (this.id) {
            this.title = `#${this.id}`;
            this.messageById();
        } else {
            this.title = 'Kreiraj Novu Poruku';
        }

        this.messageForm = this.fb.group({
            subject: ['', Validators.required],
            body: ['', Validators.required],
            code: ['', Validators.required],
            actions: this.fb.array([]),
        });
    }

    get actions(): FormArray {
        return this.messageForm.get('actions') as FormArray;
    }

    get body() {
        return this.messageForm.get('body')?.value;
    }
    config: AngularEditorConfig = {
        sanitize: false,
        editable: true,
        spellcheck: true,
        width: '500px',
        height: '15rem',
        minHeight: '5rem',
        placeholder: 'Vaša poruka...',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        toolbarHiddenButtons: [['bold']],
    };
    //Get action
    getAction(): FormArray {
        return this.messageForm.get('actions') as FormArray;
    }

    //Add to array
    addActionsToArray() {
        this.getAction().push(this.addObjFormGroup());
    }

    addObjFormGroup(): FormGroup {
        return this.fb.group({
            code: [''],
            notificationChannel: [''],
        });
    }

    removeAction(i: number) {
        const control = <FormArray>this.messageForm.controls['actions'];
        control.removeAt(i);
    }

    //Get message by id
    messageById() {
        this.messageService.getMessageTemplateId(this.id).subscribe(res => {
            this.singleMessage = res;
            this.messageForm.patchValue(res);

            res.refActionMessageTemplates.forEach(x => {
                this.getAction().push(
                    this.fb.group({
                        code: [x.refAction.code],
                        notificationChannel: [x.notificationChannel],
                    }),
                );
            });
        });
    }

    onSubmit() {
        if (this.id) {
            this.updateMessage();
        } else {
            this.createNewMessage();
        }
    }

    //Update message
    updateMessage() {
        this.singleMessage = { ...this.singleMessage, ...this.messageForm.value };
        this.isFormSubmitted = true;

        if (this.messageForm.valid) {
            this.messageService.editMessageTemplate(this.messageForm.value, this.singleMessage.id).subscribe({
                next: (res: any) => {
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

    //Get list of actions for dropdown
    getListOfActions() {
        this.messageService.getActions().subscribe((res: any) => {
            this.actionData = res;
        });
    }

    // Create new message
    createNewMessage() {
        this.messageModel = this.messageForm.value;
        this.isFormSubmitted = true;

        const arr = this.getAction()?.value;
        arr.forEach((element: any) => {
            if (element.code == null) {
                arr.shift();
            }
        });

        arr.forEach((element: any) => {
            if (element.code == '') {
                arr.shift();
            }
        });

        if (this.messageForm.valid) {
            this.messageService.postMesssageTemplate(this.messageModel).subscribe({
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
        this.router.navigate(['/main/messages'], { state: { editOrAddNewMode: true } });
    }

    showValidationMessage(controlName: string): boolean {
        let control = this.messageForm.controls[controlName];
        return control && control.invalid && (control.touched || this.isFormSubmitted);
    }
}
