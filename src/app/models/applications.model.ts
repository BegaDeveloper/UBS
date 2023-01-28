import { IBankDTO } from './bank.model';
import { RoleDto } from './user.model';

export interface ApplicationDTO {
    id: number;
    bank: IBankDTO;
    name: string;
    apiKey: string;
    privateKey: string;
    roles: RoleDto[];
}

export interface Application {
    name: string;
    bankId: number;
    roles: RoleDto[];
}

export class ApplicationData implements Application {
    constructor(public name: string, public bankId: number, public roles: RoleDto[]) {}
}
