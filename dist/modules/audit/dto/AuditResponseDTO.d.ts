import { $Enums } from "@prisma/client";
import { UserResponseDTO } from "src/modules/user/dtos/UserResponseDTO";
export declare class AuditResponseDTO {
    id: number;
    action: $Enums.AuditAction;
    createdAt: Date;
    userId: number;
    user: UserResponseDTO;
    recordId: number;
    tableName: string;
    oldData: object;
    newData: object;
    constructor(partial: Partial<UserResponseDTO>);
}
