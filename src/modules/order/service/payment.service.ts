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

@Injectable()
export class PaymentService {

    constructor(private readonly prismaService : PrismaService, private readonly cartService : CartService){}

    async initializePayment(email: string, amount: number, metadata: Metadata){
        const params = JSON.stringify({
            "email": email,
            "amount": Math.round(amount * 100),
            "currency": 'NGN',
            metadata: {
                "orderId": metadata.orderId,
                "orderTotal": metadata.amount
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

            if(payment.status === "success"){
                await this.prismaService.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        quantityAvailable: product.quantityAvailable - cartItem.quantity
                    }
                })

                await this.cartService.clearCart(userId)
            }


        })

        return payment
    }
}
