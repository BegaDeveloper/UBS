export interface MessageTemplate {
    code: string;
    subject: string;
    body: string;
}

export class MessageData implements MessageTemplate {
    code: string;
    subject: string;
    body: string;

    constructor(code: string, subject: string, body: string) {
        this.code = code;
        this.subject = subject;
        this.body = body;
    }
}
export interface RefAction {
    code: string;
    forSubscription: boolean;
    name: string;
    performedBy: string;
    position: number;
}

export interface RefActionMessageTemplates {
    notificationChannel: string;
    refAction: RefAction;
}

export interface MessageTemplateDTO {
    updatedDate: Date;
    createdDate: Date;
    createdBy: string;
    updatedBy: string;
    version: number;
    id: number;
    code: string;
    subject: string;
    body: string;
    refActionMessageTemplates: RefActionMessageTemplates[];
}

export class MessageDTOData implements MessageTemplateDTO {
    constructor(
        public updatedDate: Date,
        public createdDate: Date,
        public createdBy: string,
        public updatedBy: string,
        public version: number,
        public id: number,
        public code: string,
        public subject: string,
        public body: string,
        public refActionMessageTemplates: RefActionMessageTemplates[],
    ) {}
}

//New message models

export interface ActionsData {
    code: string;
    name: string;
    performedBy: string;
    position: number;
    forSubscription: boolean;
    bean: string;
}

export interface Action {
    code: string;
    notificationChannel: string;
}

export interface MessageBody {
    action: Action[];
    subject: string;
    body: string;
    code: string;
}

export class Actions implements MessageBody {
    constructor(public action: Action[], public code: string, public subject: string, public body: string) {}
}
