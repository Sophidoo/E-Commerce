import { Metadata } from '../dto/MetaData';
import { PrismaService } from 'src/database/prisma.service';
import { PaymentDTO } from '../dto/PaymentDTO';
import { Payment } from '@prisma/client';
import { CartService } from 'src/modules/cart/service/cart.service';
import { CouponService } from 'src/modules/coupon/service/coupon.service';
export declare class PaymentService {
    private readonly prismaService;
    private readonly cartService;
    private readonly couponService;
    constructor(prismaService: PrismaService, cartService: CartService, couponService: CouponService);
    lockProduct(productId: number, lock: boolean): Promise<void>;
    initializePayment(email: string, amount: number, metadata: Metadata, coupon?: string): Promise<unknown>;
    verifyTransaction(reference: string): Promise<unknown>;
    createPayment(dto: PaymentDTO, userId: number): Promise<Payment>;
    retrieveMonthlySales(year: number): Promise<unknown>;
}
