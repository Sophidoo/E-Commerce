import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { find } from 'rxjs';
import { PrismaService } from 'src/database/prisma.service';
import { Pagination } from 'src/interface/paginator';
import { PaginatedWishlistDTO } from '../dto/PaginatedWishListDTO';
import { WishListResponseDTO } from '../dto/WishlistResponseDTO';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class WishlistService {
    constructor(private readonly prismaService: PrismaService){}

    async addToWishList(productId : number, userId: number): Promise<string>{
        const product = await this.prismaService.product.findUnique({
            where: {
                id: productId
            }
        })

        if(!product){
            throw new NotFoundException(`Product with id = ${productId} not found`)
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        }) 

        if(!user){
            throw new NotFoundException(`User with id = ${userId} not found`)
        }

        const findProductInWishList = await this.prismaService.wishList.findFirst({
            where: {
                AND: {
                    id: user.wishlistId,
                    product: {
                        some: {
                            id: productId
                        }
                    }
                }
            }
        })

        if(findProductInWishList){
            return "Product already exists in wishlist"
        }

        await this.prismaService.wishList.update({
            where: {
                id: user.wishlistId
            },
            data: {
                product: {
                    connect:{
                        id: product.id
                    }
                }
            }
        })

        return "Product added to wishlist"
    }

    async removeFromWishList(productId : number, userId : number){
        const product = await this.prismaService.product.findUnique({
            where: {
                id: productId
            }
        })

        if(!product){
            throw new NotFoundException(`Product with id = ${productId} not found`)
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        }) 

        if(!user){
            throw new NotFoundException(`User with id = ${userId} not found`)
        }

        const findProductInWishList = await this.prismaService.wishList.findFirst({
            where: {
                AND: {
                    id: user.wishlistId,
                    product: {
                        some: {
                            id: product.id
                        }
                    }
                }
            }
        })

        if(!findProductInWishList){
            return "Product does not exists in wishlist"
        }

        await this.prismaService.wishList.update({
            where:{
                id: user.wishlistId
            },
            data: {
                product: {
                    disconnect: {
                        id: product.id
                    }
                }
            }
        })

        return "Product removed from wishlist"
    }

    async viewAllInWishlist({pageNo, pageSize, sortBy, sortDir, filterParam} : Pagination, id: number) : Promise<PaginatedWishlistDTO>{
        const orderBy: Prisma.ProductOrderByWithRelationInput = sortBy && sortDir ?  {[sortBy] : sortDir} : undefined
        
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        const page = pageNo || 1
        const size = pageSize || 20
        const wishlistProducts = await this.prismaService.wishList.findUnique({
            where: {
                id:user.wishlistId
            },
            include: {
                product: {
                    where: {
                        productName: {
                            contains: filterParam
                        }
                    },
                    take: size,
                    skip: (page - 1) * size,
                    orderBy,
                }
            }

        })


        

        const totalCount = await this.prismaService.wishList.findUnique({
            where: {
                id: user.wishlistId
            },
            
        }).product()

        const result = new PaginatedWishlistDTO()
        result.data = plainToInstance(WishListResponseDTO, wishlistProducts)
        result.filterBy = "Produt Name"
        result.filterParam = filterParam
        result.sortBy = sortBy
        result.sortDir = sortDir
        result.pageNo = page
        result.pageSize = size
        result.totalPages = Math.ceil(totalCount.length/size)

        return result
    }


}
