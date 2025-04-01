import { Account } from "./account";

export interface AccountAPIRequest {
    token?: string;
}

export interface AccountAPIReqonse {
    statusCode: number;
    body: Account | Account[] | string;
    headers?: Record<string, string>;
    error?: any;
}