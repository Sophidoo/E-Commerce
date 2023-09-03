import { AuditService } from '../service/audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAllAudit(): Promise<import("../dto/AuditResponseDTO").AuditResponseDTO[]>;
}
