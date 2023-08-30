import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CouponDTO, EditCouponDTO } from '../dto/CouponDTO';
import { CouponResponseDTO } from '../dto/CouponResponseDTO';
import { AuditDTO } from 'src/modules/audit/dto/AuditDTO';
import { AuditService } from 'src/modules/audit/service/audit.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CouponService {
    constructor(private readonly prismaService : PrismaService, private readonly auditSercice : AuditService){}

    async createCoupon (dto: CouponDTO, userId: number) : Promise<CouponResponseDTO>{

        const couponExist = await this.prismaService.coupon.findUnique({
            where: {
                couponCode: dto.couponCode
            }
        })

        if(couponExist){
            throw new ConflictException("Coupon with this code already exists")
        }

        const coupon = await this.prismaService.coupon.create({
            data: {
                couponCode: dto.couponCode,
                discountPercentage: dto.discountPercentage,
                expiryDate: dto.expiryDate,
            }
        })

        const audit = new AuditDTO
        audit.action = 'CREATE'
        audit.createdAt = new Date()
        audit.oldData = {}
        audit.newData = {
            ...coupon
        }
        audit.recordId = coupon.id
        audit.tableName = "Coupon"
        audit.userId = userId
        await this.auditSercice.addToAudit(audit)

        return plainToInstance(CouponResponseDTO, coupon)
    }

    async editCoupon(couponId: number, dto: EditCouponDTO, userId: number){
        const couponExist = await this.prismaService.coupon.findUnique({
            where: {
                id: couponId
            }
        })

        if(!couponExist){
            throw new NotFoundException("Coupon with this id does not exist")
        }

        if(dto.couponCode){
            const couponCodeExist = await this.prismaService.coupon.findUnique({
                where: {
                    couponCode: dto.couponCode
                }
            })
    
            if(couponCodeExist){
                throw new ConflictException("Coupon with this code already exists")
            }
        }

        const coupon = await this.prismaService.coupon.update({
            where:{
                id : couponId
            },
            data: {
                couponCode: dto.couponCode,
                discountPercentage: dto.discountPercentage,
                expiryDate: dto.expiryDate,
            }
        })

        const audit = new AuditDTO
        audit.action = 'UPDATE'
        audit.createdAt = new Date()
        audit.oldData = {
            ...couponExist
        }
        audit.newData = {
            ...coupon
        }
        audit.recordId = coupon.id
        audit.tableName = "Coupon"
        audit.userId = userId
        await this.auditSercice.addToAudit(audit)

        return plainToInstance(CouponResponseDTO, coupon)
    }

    async deleteCoupon(couponId : number, userId : number) : Promise<string>{
        const couponExist = await this.prismaService.coupon.findUnique({
            where: {
                id: couponId
            }
        })

        if(!couponExist){
            throw new NotFoundException("Coupon with this id does not exist")
        }

        await this.prismaService.coupon.delete({
            where:{
                id: couponId
            }
        })

        const audit = new AuditDTO
        audit.action = 'DELETE'
        audit.createdAt = new Date()
        audit.oldData = {
            ...couponExist
        }
        audit.newData = {}
        audit.recordId = couponExist.id
        audit.tableName = "Coupon"
        audit.userId = userId
        await this.auditSercice.addToAudit(audit)

        return "Coupon deleted successfully"
    }

    async viewAllCoupons() : Promise<CouponResponseDTO[]>{
        const coupons = await this.prismaService.coupon.findMany()

        return coupons.map(coupon => plainToInstance(CouponResponseDTO, coupon))
    }

    async findAParticularCoupon(couponCode: string) : Promise<CouponResponseDTO>{
        const coupon = await this.prismaService.coupon.findUnique({
            where: {
                couponCode
            }
        })

        if(!coupon){
            throw new NotFoundException("Coupon with this code does not exist")
        }

        return plainToInstance(CouponResponseDTO, coupon)
    }
}
