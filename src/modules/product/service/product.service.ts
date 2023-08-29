import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProductDTO } from '../dto/ProductDTO';
import { ProductResponseDTO } from '../dto/ProductResponseDTO';
import { plainToInstance } from 'class-transformer';
import { EditProductDTO } from '../dto/EditProductDTO';
import { Pagination } from 'src/interface/paginator';
import { Prisma, ProductImage } from '@prisma/client';
import { PaginatedProductDTO } from '../dto/PaginatedProductDTO';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { ProductImageUploadDTO } from '../dto/ProductImageUploadDTO';
import { ProductImageResponseDTO } from '../dto/ProductImageResponseDTO';
import { CategoryDTO } from '../dto/CategoryDTO';
import { CategoryResponseDTO } from '../dto/CategoryResponseDTO';
import { retry } from 'rxjs';

@Injectable()
export class ProductService {
    constructor(private readonly prismaService : PrismaService, private readonly cloudinaryService : CloudinaryService){}

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
            where,
            include: {
                productImages: true
            }

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
        const products = await this.prismaService.product.findMany({
            include: {
                productImages: true
            }
        })

        return  products.map((product) => plainToInstance(ProductResponseDTO, product))
    }


    async addproductImages(file : Express.Multer.File, id: number, dto: ProductImageUploadDTO ) : Promise<ProductImageResponseDTO>{
        const result = await this.cloudinaryService.uploadFile(file)
        
        const product = await this.prismaService.product.findUnique({
            where: {
                id
            }
        })

        if(!product){
            throw new NotFoundException(`Product with that id = ${id} does not exist`)
        }

        if(!result){
            throw new InternalServerErrorException("An error occured while uploading image to cloudinary")
        }

        if(dto.defaultImage){
            const findDefaultImage = await this.prismaService.productImage.findFirst({
                where: {
                    AND: {
                        productId: id,
                        defaultImage: true
                    }
                }
            })
    
            if(findDefaultImage){
                await this.prismaService.productImage.update({
                    where: {
                        id: findDefaultImage.id
                    },
                    data: {
                        defaultImage: false
                    }
                })
            }
        }
        
        const productImage = await this.prismaService.productImage.create({
            data: {
                imageUrl: result.url,
                productId: id,
                defaultImage: dto.defaultImage
            },
            select: {
                product: {
                    select: {
                        productName: true,
                        productPrice: true,
                        brand: true,
                        description: true,
                        quantityAvailable: true,
                        size: true,
                        category: {
                            select: {
                                categoryName: true
                            }
                        }
                    }
                },
                imageUrl: true,
                defaultImage: true
            }
        })

        return plainToInstance(ProductImageResponseDTO, productImage)
        
    }


    async editProductImages(file: Express.Multer.File, id: number, dto: ProductImageUploadDTO) : Promise<ProductImageResponseDTO>{
        const result = await this.cloudinaryService.uploadFile(file)
        
        const image = await this.prismaService.productImage.findUnique({
            where: {
                id
            }
        })

        if(!image){
            throw new NotFoundException(`Product Image with that id = ${id} does not exist`)
        }

        if(!result){
            throw new InternalServerErrorException("An error occured while uploading image to cloudinary")
        }

        if(dto.defaultImage){
            const findDefaultImage = await this.prismaService.productImage.findFirst({
                where: {
                    AND: {
                        productId: id,
                        defaultImage: true
                    }
                }
            })
    
            if(findDefaultImage){
                await this.prismaService.productImage.update({
                    where: {
                        id: findDefaultImage.id
                    },
                    data: {
                        defaultImage: false
                    }
                })
            }
        }
        
        const productImage = await this.prismaService.productImage.update({
            where: {
                id,
            },
            data: {
                imageUrl: result.url,
                defaultImage: dto.defaultImage
            },
            select: {
                product: {
                    select: {
                        productName: true,
                        productPrice: true,
                        brand: true,
                        description: true,
                        quantityAvailable: true,
                        size: true,
                        category: {
                            select: {
                                categoryName: true
                            }
                        }
                    }
                },
                imageUrl: true,
                defaultImage: true
            }
        })

        return plainToInstance(ProductImageResponseDTO, productImage)
    }


    async deleteProductImage(id: number) : Promise<string>{
        const image = await this.prismaService.productImage.findUnique({
            where: {
                id
            }
        })

        if(!image){
            throw new NotFoundException(`Product Image with that id = ${id} does not exist`)
        }

        await this.prismaService.productImage.delete({
            where: {
                id
            }
        })

        return "Product image deleted successfully"
    }

    async addCategory(dto: CategoryDTO) : Promise<CategoryResponseDTO | string>{
        const findCategory = await this.prismaService.category.findUnique({
            where: {
                categoryName: dto.categoryName
            }
        })

        if(findCategory){
            throw new ConflictException('Category Already exists')
        }

        const category = await this.prismaService.category.create({
            data: {
                ...dto
            }
        })

        return plainToInstance(CategoryResponseDTO, category)
    }

    async editCategory(dto: CategoryDTO, categoryId : number) : Promise<CategoryResponseDTO | string>{
        const category = await this.prismaService.category.findUnique({
            where: {
                id: categoryId
            }
        })

        if(!category){
            throw new NotFoundException('Category not found')
        }

        const findCategory = await this.prismaService.category.findUnique({
            where: {
                categoryName: dto.categoryName
            }
        })

        if(findCategory){
            throw new ConflictException('Category with that name already exists')
        }

        const update= await this.prismaService.category.update({
            where:{
                id: categoryId
            },
            data: {
                categoryName: dto.categoryName
            }
        })

        return plainToInstance(CategoryResponseDTO, update)
    }

    async getAllCategories() : Promise<CategoryResponseDTO[]>{
        const categories = await this.prismaService.category.findMany()

        return categories.map((category) => plainToInstance(CategoryResponseDTO, category))
    }

    async findByCategoryName(categoryName: string) : Promise<CategoryResponseDTO>{
        const category = await this.prismaService.category.findUnique({
            where: {
                categoryName
            }
        })

        if(!category){
            throw new NotFoundException('Category not found')
        }

        return plainToInstance(CategoryResponseDTO, category)
    }

    async deleteCategory(categoryId : number) : Promise<string>{
        const category = await this.prismaService.category.findUnique({
            where: {
                id: categoryId
            },
            include: {
                product: true
            }
        })

        if(!category){
            throw new NotFoundException('Category not found')
        }

        if(category.product.length !== 0){
            return "Can not delete category because some products belong to this category"
        }

        await this.prismaService.category.delete({
            where: {
                id: categoryId
            }
        })

        return "Category deleted successflly"

    }




}
