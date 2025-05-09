interface LoginTokenResult {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    scope: string;
}

export default LoginTokenResult;