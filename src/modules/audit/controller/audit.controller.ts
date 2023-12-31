import { Controller, Get } from '@nestjs/common';
import { AuditService } from '../service/audit.service';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
    constructor(private readonly auditService : AuditService){}

    @Get()
    @Roles(RoleType.ADMIN)
    getAllAudit(){
        return this.auditService.viewAllAudit()
    }
}
