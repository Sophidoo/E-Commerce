import { PrismaService } from 'src/database/prisma.service';
import { AuditResponseDTO } from '../dto/AuditResponseDTO';
import { AuditDTO } from '../dto/AuditDTO';
export declare class AuditService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    addToAudit(dto: AuditDTO): Promise<AuditResponseDTO>;
    viewAllAudit(): Promise<AuditResponseDTO[]>;
}
