export declare class UserResponseDTO {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    phoneNumber: string;
    dateOfBirth: Date;
    image: string;
    gender: string;
    isVerified: boolean;
    email: string;
    role: string;
    constructor(partial: Partial<UserResponseDTO>);
}
