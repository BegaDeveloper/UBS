export interface RefAction {
    code: string;
    name: string;
    bean: string;
    performedBy: string;
    position: number;
    forSubscription: boolean;
}

export interface EmailNotification {
    notificationChannel: string;
    subscribed: boolean;
}

export interface AppNotification {
    notificationChannel: string;
    subscribed: boolean;
}

export interface subscriptionRequestItems {
    userId: number;
    refAction: RefAction;
    emailNotification: EmailNotification;
    appNotification: AppNotification;
}

export interface RootObject {
    subscriptionRequestItems: subscriptionRequestItems[];
}

export class RootObjectDTO implements RootObject {
    constructor(public subscriptionRequestItems: subscriptionRequestItems[]) {}
}

//PUT
export interface SubscriptionRequestItem {
    action: string;
    notificationChannel: string;
    subscribed: boolean;
}

export interface putObject {
    subscriptionRequestItems: SubscriptionRequestItem[];
}

export class SubscriptionRequestPut implements putObject {
    constructor(public subscriptionRequestItems: SubscriptionRequestItem[]) {}
}

export interface SubscriptionNotification {
    message: string;
}

/*export interface SubscriptionNotificationDTO {
    subscriptionNotifications: SubscriptionNotification[];
    count: number;
}*/

//New model
export interface Content {
    updatedDate: Date;
    createdDate: Date;
    createdBy: string;
    updatedBy: string;
    version: number;
    id: number;
    read: boolean;
    action: string;
    message: string;
}

export interface Sort {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
}

/*export interface Sort2 {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
}*/

export interface Pageable {
    offset: number;
    sort: Sort;
    unpaged: boolean;
    paged: boolean;
    pageNumber: number;
    pageSize: number;
}

export interface Notifications {
    totalPages: number;
    totalElements: number;
    size: number;
    content: Content[];
    number: number;
    sort: Sort;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: Pageable;
    empty: boolean;
}

export interface SubscriptionNotificationDTO {
    notifications: Notifications;
    unreadCount: number;
}
