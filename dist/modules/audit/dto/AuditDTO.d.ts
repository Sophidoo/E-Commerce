import { $Enums } from "@prisma/client";
export declare class AuditDTO {
    action: $Enums.AuditAction;
    createdAt: Date;
    userId: number;
    recordId: number;
    tableName: string;
    oldData: object;
    newData: object;
}
