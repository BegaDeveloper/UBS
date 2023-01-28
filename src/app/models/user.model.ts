import { IBankDTO } from './bank.model';

export enum RoleDto {
    SUPERADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN',
    OPERATOR_NEW = 'OPERATOR_NEW',
    OPERATOR_PREV = 'OPERATOR_PREV',
}

export interface IUserDTO {
    updatedDate: Date;
    createdDate: Date;
    createdBy: string;
    updatedBy: string;
    version: number;
    id: number;
    bank: IBankDTO;
    login: string;
    firstName: string;
    lastName: string;
    active: boolean;
    passwordHash: string;
    activationKey: string;
    activationEndDate: Date;
    resetKey: string;
    resetEndDate: Date;
    roles: RoleDto[];
    enabled: boolean;
    locked: boolean;
}

export class ActivateUserRequest {
    password: string;
    activationKey: string;
}

export interface NewUser {
    id: number;
    login: string;
    firstName: string;
    lastName: string;
    roles: string[];
    enabled: boolean;
}

export class NewUserData implements NewUser {
    constructor(
        public id: number,
        public login: string,
        public firstName: string,
        public lastName: string,
        public roles: string[],
        public enabled: boolean,
    ) {}
}

export interface ActivationLink {
    activationKey: string;
}

export class NewActivationLink implements ActivationLink {
    constructor(public activationKey: string) {}
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}

export class DataChangePassword implements ChangePassword {
    constructor(public oldPassword: string, public newPassword: string) {}
}

export interface UnlockTheUser {
    locked: boolean;
}

export class UnlockData implements UnlockTheUser {
    constructor(public locked: boolean) {}
}


export class AuthenticateResponse {
    constructor(
        public accessToken: string,
        public refreshToken: string,
        public accessTokenValidUntil: Date,
        public refreshTokenValidUntil: Date
    ) {}
}
