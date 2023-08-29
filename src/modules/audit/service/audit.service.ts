import { Injectable } from '@nestjs/common';
import { Audit } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { AuditResponseDTO } from '../dto/AuditResponseDTO';
import { plainToInstance } from 'class-transformer';
import { AuditDTO } from '../dto/AuditDTO';

@Injectable()
export class AuditService {
    constructor(private readonly prismaService:PrismaService){}

    async addToAudit(dto: AuditDTO) : Promise<AuditResponseDTO>{
        const audit = await this.prismaService.audit.create({
            data: {
                ...dto
            }
        })

        return plainToInstance(AuditResponseDTO, audit)
    }

    async viewAllAudit() : Promise<AuditResponseDTO[]>{
        const audits = await this.prismaService.audit.findMany({
            select: {
                id: true,
                action: true,
                createdAt: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                        username: true,
                        image: true,
                        role: true
                    }
                },
                recordId: true,
                tableName: true,
                oldData: true,
                newData: true
            }
        })

        return audits.map(audit => plainToInstance(AuditResponseDTO, audit))
    }
}
