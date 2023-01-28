export interface ILoanType {
    updatedDate: Date;
    createdDate: Date;
    createdBy: string;
    updatedBy: string;
    version: number;
    id: number;
    code: string;
    categoryType: string;
    name: string;
}

export interface ILoanData {
    code: string;
    categoryType: string;
    name: string;
}
export class LoanData implements ILoanData {
    code: string;
    categoryType: string;
    name: string;

    constructor(code: string, categoryType: string, name: string) {
        this.code = code;
        this.categoryType = categoryType;
        this.name = name;
    }
}
