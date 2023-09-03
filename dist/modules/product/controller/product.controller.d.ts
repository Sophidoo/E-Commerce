/// <reference types="multer" />
import { ProductService } from '../service/product.service';
import { ProductDTO } from '../dto/ProductDTO';
import { ProductResponseDTO } from '../dto/ProductResponseDTO';
import { EditProductDTO } from '../dto/EditProductDTO';
import { PaginatedProductDTO } from '../dto/PaginatedProductDTO';
import { ProductImageUploadDTO } from '../dto/ProductImageUploadDTO';
import { CategoryDTO } from '../dto/CategoryDTO';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    addProduct(dto: ProductDTO, user: number): Promise<ProductResponseDTO>;
    editProduct(dto: EditProductDTO, id: number, user: number): Promise<ProductResponseDTO>;
    deleteProduct(id: number, user: number): Promise<string>;
    getProductById(id: number): Promise<ProductResponseDTO>;
    getAllProducts(pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, filterBy?: string, filterParam?: string, filterKey?: string, filterValue?: string): Promise<PaginatedProductDTO>;
    getAll(): Promise<ProductResponseDTO[]>;
    uploadImage(file: Express.Multer.File, id: number, dto: ProductImageUploadDTO, user: number): Promise<import("../dto/ProductImageResponseDTO").ProductImageResponseDTO>;
    editProductImage(file: Express.Multer.File, id: number, dto: ProductImageUploadDTO, user: number): Promise<import("../dto/ProductImageResponseDTO").ProductImageResponseDTO>;
    deleteIMage(id: number, user: number): Promise<string>;
    addCategory(dto: CategoryDTO, user: number): Promise<string | import("../dto/CategoryResponseDTO").CategoryResponseDTO>;
    editCategory(dto: CategoryDTO, categoryId: number, user: number): Promise<string | import("../dto/CategoryResponseDTO").CategoryResponseDTO>;
    findByCategoryName(categoryName: string): Promise<import("../dto/CategoryResponseDTO").CategoryResponseDTO>;
    getAllCategories(): Promise<import("../dto/CategoryResponseDTO").CategoryResponseDTO[]>;
    deleteEmptyCategory(categoryId: number, user: number): Promise<string>;
}
