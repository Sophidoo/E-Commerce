import { PrismaService } from 'src/database/prisma.service';
import { CouponDTO, EditCouponDTO } from '../dto/CouponDTO';
import { CouponResponseDTO } from '../dto/CouponResponseDTO';
import { AuditService } from 'src/modules/audit/service/audit.service';
export declare class CouponService {
    private readonly prismaService;
    private readonly auditSercice;
    constructor(prismaService: PrismaService, auditSercice: AuditService);
    createCoupon(dto: CouponDTO, userId: number): Promise<CouponResponseDTO>;
    editCoupon(couponId: number, dto: EditCouponDTO, userId: number): Promise<CouponResponseDTO>;
    deleteCoupon(couponId: number, userId: number): Promise<string>;
    viewAllCoupons(): Promise<CouponResponseDTO[]>;
    findAParticularCoupon(couponCode: string): Promise<CouponResponseDTO>;
}
