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
import { CategoryDTO } from '../dto/CategoryDTO';
import { User } from 'src/decorator/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('api/v1/product')
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @Roles(RoleType.ADMIN)
    @Post()
    addProduct(@Body() dto: ProductDTO , @User() user : number) : Promise<ProductResponseDTO>{
        return this.productService.addProduct(dto, user)
    }


    @Roles(RoleType.ADMIN)
    @Patch('/:id')
    editProduct(@Body() dto: EditProductDTO, @Param('id') id: number , @User() user : number) : Promise<ProductResponseDTO>{
        return this.productService.editProduct(id, dto, user)
    }

    
    @Roles(RoleType.ADMIN)
    @Delete('/:id')
    deleteProduct(@Param('id') id: number, @User() user : number) : Promise<string>{
        return this.productService.deleteProduct(id, user)
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
    ) file: Express.Multer.File, @Param('id') id:number, @Body() dto: ProductImageUploadDTO, @User() user : number){
       return this.productService.addproductImages(file, id, dto, user)
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
    ) file: Express.Multer.File, @Param('id') id:number, @Body() dto: ProductImageUploadDTO, @User() user : number){
       return this.productService.editProductImages(file, id, dto, user)
    }


    @Delete('/deleteImage/:id')
    @Roles(RoleType.ADMIN)
    deleteIMage(@Param('id') id: number, @User() user : number)    {
        return this.productService.deleteProductImage(id, user)
    }


    @Post('/category')
    @Roles(RoleType.ADMIN)
    addCategory(@Body() dto : CategoryDTO, @User() user : number){
        return this.productService.addCategory(dto, user)
    }


    @Put('/category/:categoryId')
    @Roles(RoleType.ADMIN)
    editCategory(@Body() dto: CategoryDTO, @Param('categoryId') categoryId: number, @User() user : number){
        return this.productService.editCategory(dto, categoryId, user)
    }


    @Get('/category/:categoryName')
    @Roles(RoleType.ADMIN)
    findByCategoryName(@Param('categoryName') categoryName : string){
        return this.productService.findByCategoryName(categoryName)
    }


    @Get('/category')
    @Roles(RoleType.ADMIN)
    getAllCategories(){
        return this.productService.getAllCategories()
    }


    @Delete('/category/:categoryId')
    @Roles(RoleType.ADMIN)
    deleteEmptyCategory(@Param('categoryId') categoryId : number, @User() user : number){
        return this.productService.deleteCategory(categoryId, user)
    }
    
}
