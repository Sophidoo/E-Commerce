import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProductDTO } from '../dto/ProductDTO';
import { ProductResponseDTO } from '../dto/ProductResponseDTO';
import { plainToInstance } from 'class-transformer';
import { EditProductDTO } from '../dto/EditProductDTO';
import { Pagination } from 'src/interface/paginator';
import { Prisma } from '@prisma/client';
import { PaginatedProductDTO } from '../dto/PaginatedProductDTO';

@Injectable()
export class ProductService {
    constructor(private readonly prismaService : PrismaService){}

    async addProduct(dto : ProductDTO) : Promise<ProductResponseDTO>{
        const product = await this.prismaService.product.create({
            data: {
                productName: dto.productName,
                productPrice: dto.productPrice,
                size : dto.size,
                brand: dto.brand,
                category: {
                    connectOrCreate: {
                        where: {
                            categoryName: dto.category
                        },
                        create: {
                            categoryName: dto.category
                        }
                    }
                },
                quantityAvailable: dto.quantityAvailable,
                description: dto.description
            }
        })

        return plainToInstance(ProductResponseDTO, product)
    }

    async editProduct(id : number, dto: EditProductDTO) : Promise<ProductResponseDTO>{
        const findProduct = await this.prismaService.product.findUnique({
            where: {
                id
            }
        })

        if(!findProduct){
            throw new NotFoundException('Product does not exist in the database')
        }


        const product = await this.prismaService.product.update({
            where: {
                id
            },
            data: {
                productName: dto.productName,
                productPrice: dto.productPrice,
                size : dto.size,
                brand: dto.brand,
                category: {
                    connectOrCreate: {
                        where: {
                            categoryName: dto.category
                        },
                        create: {
                            categoryName: dto.category
                        }
                    }
                },
                quantityAvailable: dto.quantityAvailable,
                description: dto.description
            }
        })

        return plainToInstance(ProductResponseDTO, product)
    }


    async getProductById(id: number) : Promise<ProductResponseDTO>{
        const findProduct = await this.prismaService.product.findUnique({
            where: {
                id
            }
        })

        if(!findProduct){
            throw new NotFoundException('Product does not exist in the database')
        }

        return plainToInstance(ProductResponseDTO, findProduct)
    }


    async getProductDefaultImage(id: number) : Promise<ProductResponseDTO>{
        const findProduct = await this.prismaService.product.findUnique({
            where: {
                id
            },
            select: {
                productImages: {
                    where: {
                        defaultImage: true
                    }
                }
            }
        })

        if(!findProduct){
            throw new NotFoundException('Product does not exist in the database')
        }

        return plainToInstance(ProductResponseDTO, findProduct)
    }

    async deleteProduct(id : number) : Promise<string>{
        const findProduct = await this.prismaService.product.findUnique({
            where: {
                id
            }
        })

        if(!findProduct){
            throw new NotFoundException('Product does not exist in the database')
        }

        await this.prismaService.product.delete({
            where: {
                id
            }
        })

        return "Product Successfully Deleted"

    }

    

    
    // pagination
    // query
    async getAllProduct({pageNo, pageSize, sortBy, sortDir, filterBy, filterParam, filterKey, filterValue} : Pagination) : Promise<PaginatedProductDTO>{
        const orderBy: Prisma.ProductOrderByWithRelationInput = sortBy && sortDir ?  {[sortBy] : sortDir} : undefined

        let where : Prisma.ProductWhereInput = undefined
        if(filterBy === 'productPrice' ||filterBy ===  'id' || filterBy ===  'quantityAvailable'){
            filterValue = Number(filterValue)
        }
        if(filterBy && filterParam ){
            where =  {[filterBy] : filterParam}
        }else if(filterKey && filterValue){
            where  = {[filterBy] : {[filterKey]: filterValue}}
        }
        const page = pageNo || 1
        const size = pageSize || 20
        const products = await this.prismaService.product.findMany({
            take: size,
            skip: (page - 1) * size,
            orderBy,
            where

        })

        const totalCount = await this.prismaService.product.count({where})

        const result = new PaginatedProductDTO()
        result.data = plainToInstance(ProductResponseDTO, products)
        result.filterBy = filterBy
        result.filterParam = filterParam
        result.sortBy = sortBy
        result.sortDir = sortDir
        result.pageNo = page
        result.pageSize = size
        result.totalPages = Math.ceil(totalCount/size)

        return result
    }

    async getAllProductWithoutPagination() : Promise<ProductResponseDTO[]> {
        const products = await this.prismaService.product.findMany()

        return  products.map((product) => plainToInstance(ProductResponseDTO, product))
    }


    async addproductImages(){}


    async editProductImages(){}


    async deleteProductImage(){}


}
