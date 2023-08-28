import { Controller, Post, Body, Patch, Param, Delete, Get, Query, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, ParseFilePipe, FileTypeValidator, Put } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductDTO } from '../dto/ProductDTO';
import { ProductResponseDTO } from '../dto/ProductResponseDTO';
import { EditProductDTO } from '../dto/EditProductDTO';
import { Roles } from 'src/decorator/roles.decorator';
import { Prisma, RoleType } from '@prisma/client';
import { Public } from 'src/decorator/public.decorator';
import { PaginatedProductDTO } from '../dto/PaginatedProductDTO';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ProductImageUploadDTO } from '../dto/ProductImageUploadDTO';

@Controller('api/v1/product')
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @Roles(RoleType.ADMIN)
    @Post()
    addProduct(@Body() dto: ProductDTO) : Promise<ProductResponseDTO>{
        return this.productService.addProduct(dto)
    }

    @Roles(RoleType.ADMIN)
    @Patch('/:id')
    editProduct(@Body() dto: EditProductDTO, @Param('id') id: number) : Promise<ProductResponseDTO>{
        return this.productService.editProduct(id, dto)
    }
    
    @Roles(RoleType.ADMIN)
    @Delete('/:id')
    deleteProduct(@Param('id') id: number) : Promise<string>{
        return this.productService.deleteProduct(id)
    }

    @Public()
    @Get('/product/:id')
    getProductById(@Param('id') id: number){
        return this.productService.getProductById(id)
    }
    
    @Get()
    @Public()
    getAllProducts(@Query('pageNo') pageNo? : number, @Query('pageSize') pageSize? : number, @Query('sortBy') sortBy? : string, @Query('sortDir') sortDir? : string, @Query('filterBy') filterBy? : string, @Query('filterParam') filterParam? : string, @Query('filterKey') filterKey? : string, @Query('filterValue') filterValue? : string) : Promise<PaginatedProductDTO>{
        return this.productService.getAllProduct({pageNo, pageSize, sortBy, sortDir, filterBy, filterParam, filterKey, filterValue})
    }

    @Public()
    @Get('/all')
    getAll() : Promise<ProductResponseDTO[]>{
        return this.productService.getAllProductWithoutPagination()
    }

    @Post('/upload/:id')
    @Roles(RoleType.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    
    uploadImage(@UploadedFile(
        new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType:  /(jpg|jpeg|png|gif)$/
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file: Express.Multer.File, @Param('id') id:number, @Body() dto: ProductImageUploadDTO){
       return this.productService.addproductImages(file, id, dto)
    }

    @Put('/editImage/:id')
    @Roles(RoleType.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    editProductImage(@UploadedFile(
        new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType:  /(jpg|jpeg|png|gif)$/
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file: Express.Multer.File, @Param('id') id:number, @Body() dto: ProductImageUploadDTO){
       return this.productService.editProductImages(file, id, dto)
    }

    @Delete('/deleteImage/:id')
    @Roles(RoleType.ADMIN)
    deleteIMage(@Param('id') id: number)    {
        return this.productService.deleteProductImage(id)
    }

    
}
