export declare class EditAuthDetailsDTO {
    username?: string;
    email?: string;
    constructor(partial: Partial<EditAuthDetailsDTO>);
}
export declare class EditPasswordDTO {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export declare class ForgotPasswordDTO {
    email: string;
}
export declare class ResetPasswordDTO {
    newPassword: string;
    confirmPassword: string;
}
export declare class verifyOtpDTO {
    otp: string;
}
