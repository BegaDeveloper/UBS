import { NextActionDateStatusService } from '../services/next-action-date.service';
import * as dayjs from 'dayjs';
import { IBankDTO } from './bank.model';
import { IPageable, ISort } from './common.model';
import { RefStatusModel } from './ref-status.model';

export interface IRefRequestLoan {
    externalId: string;
    amount: any;
    contractDate: string;
    loanTypeId: string;
}

export interface IRefinanceData {
    debtorType: string;
    debtorName: string;
    debtorId: string;
    prevBankId: string;
    newBankId: string;
    refRequestLoans: IRefRequestLoan[];
    documents: number[];
}

export class RefinanceData implements IRefinanceData {
    constructor(
        public debtorType: string,
        public debtorName: string,
        public debtorId: string,
        public prevBankId: string,
        public newBankId: string,
        public refRequestLoans: IRefRequestLoan[],
        public documents: number[],
    ) {}
}

export interface IDocumentDTO {
    id: number;
    name: string;
    documentType: string;
    externalId: string;
    externalName: string;
}

export interface RefRequestDocument {
    id: number;
    refRequestId: number;
    document: IDocumentDTO;
}

export interface IContent {
    updatedDate: Date;
    createdDate: Date;
    createdBy: string;
    updatedBy: string;
    version: number;
    id: number;
    newBank: IBankDTO;
    prevBank: IBankDTO;
    debtorId: string;
    debtorName: string;
    debtorType: string;
    refStatus: RefStatusModel;
    nextActionDate: Date;
    refRequestLoans: IRefRequestLoan[];
    documents: RefRequestDocument[];
}

export interface IRefinance {
    content: IContent[];
    pageable: IPageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: ISort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export class RefinanceTableContent {
    content: RefinanceTable[] = [];
    totalElements: number;
}

export class RefinanceTable {
    id: number;
    newBank: string;
    prevBank: string;
    debtorId: string;
    debtorName: string;
    refStatus: string;
    nextActionDate: string;
    updatedDate: string;
}

export class TransformContent {
    static transform(content: IContent) {
        const refinanceTable = new RefinanceTable();
        const nextActionDateStatusService = new NextActionDateStatusService();

        refinanceTable.id = content.id;
        refinanceTable.newBank = content.newBank.shortName;
        refinanceTable.prevBank = content.prevBank.shortName;
        refinanceTable.debtorId = content.debtorId;
        refinanceTable.debtorName = content.debtorName;
        refinanceTable.refStatus = content.refStatus.name;
        refinanceTable.nextActionDate = nextActionDateStatusService.transformDate(content.nextActionDate);
        refinanceTable.updatedDate = dayjs(content.updatedDate).format('DD.MM.YYYY.') + ' u ' + dayjs(content.updatedDate).format('HH:mm');
        return refinanceTable;
    }
}

export class RequestModel {
    updatedDate: Date;
    createdDate: Date;
    createdBy: string;
    updatedBy: string;
    version: number;
    id: number;
    newBank: IBankDTO;
    prevBank: IBankDTO;
    debtorId: string;
    debtorName: string;
    debtorType: string;
    refStatus: RefStatusModel;
    nextActionDate: string;
    refRequestLoans: RefRequestLoan[];
    refRequestReasons: any[];
    documents: any[];
}

export class RefRequestLoan {
    updatedDate: string;
    createdDate: string;
    createdBy: string;
    updatedBy: string;
    version: number;
    id: number;
    refRequestId: number;
    amount: any;
    contractDate: string;
    externalId: string;
    loanType: LoanType;
    debtAmount: any;
    debtDecreaseAmount: any;
    debtFeeAmount: any;
    debtTotalDecreaseAmount: any;
    debtTotalAmount: any;
    previousBankAccount: string;
    paymentReferenceNumber: string;
    paymentModel: string;
}

export class LoanType {
    createdDate: Date;
    version: number;
    id: number;
    code: string;
    name: string;
}

export class DebtRequestModel {
    amount: any;
    externalId: string;
    debtAmount: any;
    debtDecreaseAmount: any;
    debtFeeAmount: any;
    debtTotalDecreaseAmount: any;
    debtTotalAmount: any;
    previousBankAccount: string;
    paymentReferenceNumber: string;
    paymentModel: string;
}

export class DebtInfoRequestModel {
    sendDebtInfoRequestItems: DebtRequestModel[] = [];
    documents: number[] = [];
}

export class refinanceLoan {
    externalId: string;
    amount: number;
    contractDate: string;
    loanTypeId: number;
    debtAmount: number;
    debtDecreaseAmount: number;
    debtFeeAmount: number;
    debtTotalDecreaseAmount: number;
    debtTotalAmount: number;
    previousBankAccount: string;
    paymentReferenceNumber: string;
    paymentModel: string;
}

export class LoanTransformer {
    static transform(loan: RefRequestLoan) {
        const refLoan = new refinanceLoan();
        refLoan.externalId = loan.externalId;
        refLoan.amount = loan.amount;
        refLoan.contractDate = loan.contractDate;
        refLoan.loanTypeId = loan.loanType.id;
        refLoan.debtAmount = loan.debtAmount;
        refLoan.debtDecreaseAmount = loan.debtDecreaseAmount;
        refLoan.debtFeeAmount = loan.debtFeeAmount;
        refLoan.debtTotalDecreaseAmount = loan.debtTotalDecreaseAmount;
        refLoan.debtTotalAmount = loan.debtTotalAmount;
        refLoan.previousBankAccount = loan.previousBankAccount;
        refLoan.paymentReferenceNumber = loan.paymentReferenceNumber;
        refLoan.paymentModel = loan.paymentModel;
        return refLoan;
    }
}

export class SaveDeptInfoModel {
    saveDebtInfoRequestItems: DebtRequestModel[] = [];
    documents: number[] = [];
}
