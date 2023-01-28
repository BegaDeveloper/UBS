export interface IBankEmailDomain {
    id: number;
    emailDomain: string;
}

export interface IBankDTO {
    updatedDate: Date;
    createdDate: Date;
    createdBy?: string;
    updatedBy: string;
    version?: number;
    id: number;
    code: string;
    name: string;
    shortName: string;
    notificationMail: string;
    complainsMail: string;
    complainsUrl: string;
    active: boolean;
    bankEmailDomains: IBankEmailDomain[];
}

export interface IBankData {
    code: string;
    name: string;
    shortName: string;
    notificationMail: string;
    complainsMail: string;
    complainsUrl: string;
    bankEmailDomains: IBankEmailDomain[];
    active: boolean;
}

export class BankData implements IBankData {
    constructor(
        public code: string,
        public name: string,
        public shortName: string,
        public notificationMail: string,
        public complainsMail: string,
        public complainsUrl: string,
        public bankEmailDomains: IBankEmailDomain[],
        public active: boolean,
    ) {}
}
