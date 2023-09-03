import { CouponService } from '../service/coupon.service';
import { CouponDTO, EditCouponDTO } from '../dto/CouponDTO';
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    createCoupon(dto: CouponDTO, user: number): Promise<import("../dto/CouponResponseDTO").CouponResponseDTO>;
    editCOupon(couponId: number, dto: EditCouponDTO, user: number): Promise<import("../dto/CouponResponseDTO").CouponResponseDTO>;
    findByCouponCode(couponCode: string): Promise<import("../dto/CouponResponseDTO").CouponResponseDTO>;
    viewAllCoupons(): Promise<import("../dto/CouponResponseDTO").CouponResponseDTO[]>;
    deleteCoupon(couponId: number, user: number): Promise<string>;
}
