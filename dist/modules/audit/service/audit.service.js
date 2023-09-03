"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const AuditResponseDTO_1 = require("../dto/AuditResponseDTO");
const class_transformer_1 = require("class-transformer");
let AuditService = class AuditService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async addToAudit(dto) {
        const audit = await this.prismaService.audit.create({
            data: Object.assign({}, dto)
        });
        return (0, class_transformer_1.plainToInstance)(AuditResponseDTO_1.AuditResponseDTO, audit);
    }
    async viewAllAudit() {
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
        });
        return audits.map(audit => (0, class_transformer_1.plainToInstance)(AuditResponseDTO_1.AuditResponseDTO, audit));
    }
};
AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map