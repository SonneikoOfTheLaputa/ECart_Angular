
export  interface ApiResponse
{
     statusCode :string;
     refreshToken:string;
    expiryDate :string;
    token :string;
    retry :string;
    message:string;
    newToken:NewTokenIssue;
}
export  interface NewTokenIssue{
    refreshToken:string;
    token:string;
}
