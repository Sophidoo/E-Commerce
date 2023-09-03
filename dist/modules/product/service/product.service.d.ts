/// <reference types="multer" />
import { PrismaService } from 'src/database/prisma.service';
import { ProductDTO } from '../dto/ProductDTO';
import { ProductResponseDTO } from '../dto/ProductResponseDTO';
import { EditProductDTO } from '../dto/EditProductDTO';
import { Pagination } from 'src/interface/paginator';
import { PaginatedProductDTO } from '../dto/PaginatedProductDTO';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { ProductImageUploadDTO } from '../dto/ProductImageUploadDTO';
import { ProductImageResponseDTO } from '../dto/ProductImageResponseDTO';
import { CategoryDTO } from '../dto/CategoryDTO';
import { CategoryResponseDTO } from '../dto/CategoryResponseDTO';
import { AuditService } from 'src/modules/audit/service/audit.service';
export declare class ProductService {
    private readonly prismaService;
    private readonly cloudinaryService;
    private readonly auditService;
    constructor(prismaService: PrismaService, cloudinaryService: CloudinaryService, auditService: AuditService);
    addProduct(dto: ProductDTO, id: number): Promise<ProductResponseDTO>;
    editProduct(id: number, dto: EditProductDTO, userId: number): Promise<ProductResponseDTO>;
    getProductById(id: number): Promise<ProductResponseDTO>;
    getProductDefaultImage(id: number): Promise<ProductResponseDTO>;
    deleteProduct(id: number, userId: number): Promise<string>;
    getAllProduct({ pageNo, pageSize, sortBy, sortDir, filterBy, filterParam, filterKey, filterValue }: Pagination): Promise<PaginatedProductDTO>;
    getAllProductWithoutPagination(): Promise<ProductResponseDTO[]>;
    addproductImages(file: Express.Multer.File, id: number, dto: ProductImageUploadDTO, userId: number): Promise<ProductImageResponseDTO>;
    editProductImages(file: Express.Multer.File, id: number, dto: ProductImageUploadDTO, userId: number): Promise<ProductImageResponseDTO>;
    deleteProductImage(id: number, userId: number): Promise<string>;
    addCategory(dto: CategoryDTO, userId: number): Promise<CategoryResponseDTO | string>;
    editCategory(dto: CategoryDTO, categoryId: number, userId: number): Promise<CategoryResponseDTO | string>;
    getAllCategories(): Promise<CategoryResponseDTO[]>;
    findByCategoryName(categoryName: string): Promise<CategoryResponseDTO>;
    deleteCategory(categoryId: number, userId: number): Promise<string>;
}
