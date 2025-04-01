import { AccountPrecuroser, AccountAPIRequest } from "./";

export interface CreateAccountRequest extends
    AccountAPIRequest,
    AccountPrecuroser {
    password: string
}
