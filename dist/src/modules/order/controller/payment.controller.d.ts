import { PaymentService } from '../service/payment.service';
import { Decimal } from '@prisma/client/runtime/library';
import { Metadata } from '../dto/MetaData';
import { PaymentDTO } from '../dto/PaymentDTO';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    initiailizePayment(email: string, amount: number, metadata: Metadata, coupon?: string): Promise<unknown>;
    verifyTransaction(reference: string): Promise<unknown>;
    createPayment(dto: PaymentDTO, user: number): Promise<{
        id: number;
        orderId: number;
        createdAt: Date;
        status: string;
        amount: Decimal;
        couponId: number;
        paymentmethod: string;
    }>;
    getMonthlySales(year: number): Promise<unknown>;
}
