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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const https = require("https");
const prisma_service_1 = require("../../../database/prisma.service");
const cart_service_1 = require("../../cart/service/cart.service");
const coupon_service_1 = require("../../coupon/service/coupon.service");
let PaymentService = class PaymentService {
    constructor(prismaService, cartService, couponService) {
        this.prismaService = prismaService;
        this.cartService = cartService;
        this.couponService = couponService;
    }
    async lockProduct(productId, lock) {
        const product = await this.prismaService.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.isLocked) {
            throw new Error('Product is already locked by another user');
        }
        await this.prismaService.product.update({
            where: { id: productId },
            data: { isLocked: lock },
        });
    }
    async initializePayment(email, amount, metadata, coupon) {
        let newAmount = amount;
        let discount = 0;
        if (coupon) {
            const validCoupon = await this.couponService.findAParticularCoupon(coupon);
            if (!validCoupon) {
                throw new common_1.BadRequestException("Invalid coupon code");
            }
            if (new Date() > validCoupon.expiryDate) {
                throw new common_1.BadRequestException("Coupon is expired");
            }
            discount = (validCoupon.discountPercentage / 100) * amount;
            newAmount = amount - discount;
        }
        const order = await this.prismaService.order.findUnique({
            where: {
                id: metadata.orderId
            }
        });
        console.log("User Exists");
        if (!order) {
            throw new common_1.NotFoundException('Invalid or Expired Token');
        }
        const orderItems = await this.prismaService.orderItems.findMany({
            where: {
                orderid: order.id
            }
        });
        console.log("Cart items retreived");
        orderItems.map(async (orderItem) => {
            await this.lockProduct(orderItem.productId, true);
        });
        const params = JSON.stringify({
            "email": email,
            "amount": Math.round(newAmount * 100),
            "currency": 'NGN',
            metadata: {
                "orderId": metadata.orderId,
                "orderTotal": metadata.amount,
                "discount": discount,
                "originalAmountToPay": amount,
                "couponCode": coupon
            }
        });
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
                'Content-Type': 'application/json'
            }
        };
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    const responseData = JSON.parse(data);
                    resolve(responseData);
                });
            }).on('error', (error) => {
                reject(error);
            });
            req.write(params);
            req.end();
        });
    }
    async verifyTransaction(reference) {
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        };
        const verify = new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(JSON.parse(data));
                });
            });
            req.on('error', error => {
                reject(error);
            });
            req.end();
        });
        return verify;
    }
    async createPayment(dto, userId) {
        const payment = await this.prismaService.payment.upsert({
            create: {
                orderId: dto.orderId,
                paymentmethod: dto.paymentMethod,
                status: dto.status,
                amount: dto.amount
            },
            update: {
                paymentmethod: dto.paymentMethod,
                status: dto.status,
                amount: dto.amount
            },
            where: {
                orderId: dto.orderId
            }
        });
        if (dto.couponCode) {
            const coupon = await this.couponService.findAParticularCoupon(dto.couponCode);
            await this.prismaService.payment.update({
                where: {
                    orderId: dto.orderId
                },
                data: {
                    couponId: coupon.id
                }
            });
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        console.log("User Exists");
        if (!user) {
            throw new common_1.NotFoundException('Invalid or Expired Token');
        }
        const cartItems = await this.prismaService.cartItems.findMany({
            where: {
                cartId: user.cartId
            }
        });
        console.log("Cart items retreived");
        cartItems.map(async (cartItem) => {
            const product = await this.prismaService.product.findUnique({
                where: {
                    id: cartItem.productId
                }
            });
            if (!product) {
                throw new common_1.NotFoundException(`A product you are trying to purchase with id = ${product.id} is no longer available`);
            }
            await this.lockProduct(product.id, false);
            if (payment.status === "success") {
                await this.prismaService.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        quantityAvailable: {
                            decrement: cartItem.quantity
                        }
                    }
                });
                await this.cartService.clearCart(userId);
            }
        });
        return payment;
    }
    async retrieveMonthlySales(year) {
        const result = await this.prismaService.$queryRaw `
            SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, SUM("amount") as totalAmount
            FROM "Payment"
            WHERE "status" = 'success' AND EXTRACT(YEAR FROM "createdAt") = ${year}  
            GROUP BY month
            ORDER BY month;
            `;
        console.log(result);
        return result;
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, cart_service_1.CartService, coupon_service_1.CouponService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map