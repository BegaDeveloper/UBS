export enum Components {
    BANK = 'bank',
    USER = 'user',
    LOAN = 'loan',
    HOLIDAY = 'holiday',
    MESSAGE = 'message',
    APPLICATIONS = 'applications',
}

export enum Statuses {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    DEBT_INFO_CONFIRMED = 'DEBT_INFO_CONFIRMED',
    DEBT_INFO_SUBMITTED = 'DEBT_INFO_SUBMITTED',
    TRANS_SUBMITTED = 'TRANS_SUBMITTED',
    TRANS_CHECK_PENDING = 'TRANS_CHECK_PENDING',
    FINISHED = 'FINISHED',
    CANCELED = 'CANCELED',
    DEBT_INFO_PENDING = 'DEBT_INFO_PENDING',
    CANCELED_DUPLICATE = 'CANCELED_DUPLICATE',
}

export enum RefinanceUrl {
    NEED_UPDATE = 'ref-requests/need-update',
    NEED_ADJUSTMENT = 'ref-requests/need-adjustment',
    NEED_TRANS_CHECK = 'ref-requests/need-transaction-check',
    CANCEL = 'ref-requests/cancel',
}

export enum Reasons {
    NEED_UPDATE = 'NEED_UPDATE',
    NEED_ADJUSTMENT = 'NEED_ADJUSTMENT',
    NEED_TRANS_CHECK = 'NEED_TRANS_CHECK',
    CANCEL = 'CANCEL',
}
