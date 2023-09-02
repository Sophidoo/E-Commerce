    import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
    import { Decimal } from '@prisma/client/runtime/library';
    import * as https from "https"
    import { Metadata } from '../dto/MetaData';
    import { PrismaService } from 'src/database/prisma.service';
    import { PaymentDTO } from '../dto/PaymentDTO';
    import { Payment } from '@prisma/client';
    import { AddressResponseDTO } from 'src/modules/address/dto/AddressResponseDTO';
    import { CheckoutDTO } from '../dto/CheckoutDTO';
    import { CartService } from 'src/modules/cart/service/cart.service';
    import { CouponService } from 'src/modules/coupon/service/coupon.service';

    @Injectable()
    export class PaymentService {

        constructor(private readonly prismaService : PrismaService, private readonly cartService : CartService, private readonly couponService : CouponService){}

        // function to lock product
        async lockProduct(productId: number, lock : boolean) {
            // Check if the product is already locked
            const product = await this.prismaService.product.findUnique({
            where: { id: productId },
            });
        
            if (!product) {
            throw new Error('Product not found');
            }
        
            if (product.isLocked) {
            throw new Error('Product is already locked by another user');
            }
        
            // Lock the product
            await this.prismaService.product.update({
            where: { id: productId },
            data: { isLocked: lock },
            });
        }

        // initialize paystack transaction and make payment
        async initializePayment(email: string, amount: number,  metadata: Metadata, coupon?: string,){
            let newAmount = amount
            let discount = 0
            if(coupon){
                const validCoupon = await this.couponService.findAParticularCoupon(coupon)
                if(!validCoupon){
                    throw new BadRequestException("Invalid coupon code")
                }
        
                if(new Date() > validCoupon.expiryDate){
                    throw new BadRequestException("Coupon is expired")
                }
                discount = (validCoupon.discountPercentage/100) * amount
                newAmount = amount - discount
            }

            const order = await this.prismaService.order.findUnique({
                where: {
                    id: metadata.orderId
                }
            })

            console.log("User Exists")

            if(!order){
                throw new NotFoundException('Invalid or Expired Token')
            }

            const orderItems = await this.prismaService.orderItems.findMany({
                where: {
                    orderid: order.id
                }
            })

            console.log("Cart items retreived")

            orderItems.map(async orderItem => {
                await this.lockProduct(orderItem.productId, true);
            })

            

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
            })
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transaction/initialize',
                method: 'POST',
                headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
                'Content-Type': 'application/json'
                }
            }

            

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

        // Verify transaction
        async verifyTransaction(reference : string){
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/transaction/verify/${reference}`,
                method: 'GET',
                headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
                }
            }

            const verify =  new Promise((resolve, reject) => {
                const req = https.request(options, res => {
                    let data = ''
                
                    res.on('data', (chunk) => {
                    data += chunk
                    });
                
                    res.on('end', () => {
                        resolve(JSON.parse(data));
                    })
                })
                
                req.on('error', error => {
                    reject(error);
                })

                req.end()

                
            });   

            return verify
            
        }

        // 4Create a payment in the Payment table
        async createPayment(dto : PaymentDTO, userId : number) : Promise<Payment>{

            

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
            })

            if(dto.couponCode){
                const coupon = await this.couponService.findAParticularCoupon(dto.couponCode)

                await this.prismaService.payment.update({
                    where: {
                        orderId: dto.orderId
                    },
                    data: {
                        couponId: coupon.id
                    }
                })
            }

            const user = await this.prismaService.user.findUnique({
                where: {
                    id: userId
                }
            })

            console.log("User Exists")

            if(!user){
                throw new NotFoundException('Invalid or Expired Token')
            }

            const cartItems = await this.prismaService.cartItems.findMany({
                where: {
                    cartId: user.cartId
                }
            })

            console.log("Cart items retreived")

            cartItems.map(async cartItem => {
                const product = await this.prismaService.product.findUnique({
                    where: {
                        id: cartItem.productId
                    }
                })

                if(!product){
                    throw new NotFoundException(`A product you are trying to purchase with id = ${product.id} is no longer available`)
                }

                await this.lockProduct(product.id, false)

                if(payment.status === "success"){
                    await this.prismaService.product.update({
                        where: {
                            id: product.id
                        },
                        data: {
                            quantityAvailable: {
                                decrement : cartItem.quantity
                            }
                        }
                    })

                    await this.cartService.clearCart(userId)
                }


            })

            return payment
        }

        async retrieveMonthlySales(year : number){
            const result = await this.prismaService.$queryRaw`
            SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, SUM("amount") as totalAmount
            FROM "Payment"
            WHERE "status" = 'success' AND EXTRACT(YEAR FROM "createdAt") = ${year}  
            GROUP BY month
            ORDER BY month;
            `;

            console.log(result)

            return result;
        }
    }
