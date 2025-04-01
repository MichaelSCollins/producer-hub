import { AccountAPIRequest, AccountAPIReqonse } from "./api";
export class AccountPrecuroser {
    email?: string;
    username?: string;
    roles?: string[] = ['user'];
    updatedAt?: Date = new Date();
}
export interface Account extends AccountPrecuroser {
    id?: number;
}

export interface GetAccountRequest extends AccountAPIRequest {
    id: string | string[]
}

export type GetAccountResponse = AccountAPIReqonse
