"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const ProductResponseDTO_1 = require("../dto/ProductResponseDTO");
const class_transformer_1 = require("class-transformer");
const PaginatedProductDTO_1 = require("../dto/PaginatedProductDTO");
const cloudinary_service_1 = require("../../../config/cloudinary.service");
const ProductImageResponseDTO_1 = require("../dto/ProductImageResponseDTO");
const CategoryResponseDTO_1 = require("../dto/CategoryResponseDTO");
const audit_service_1 = require("../../audit/service/audit.service");
const AuditDTO_1 = require("../../audit/dto/AuditDTO");
let ProductService = class ProductService {
    constructor(prismaService, cloudinaryService, auditService) {
        this.prismaService = prismaService;
        this.cloudinaryService = cloudinaryService;
        this.auditService = auditService;
    }
    async addProduct(dto, id) {
        const product = await this.prismaService.product.create({
            data: {
                productName: dto.productName,
                productPrice: dto.productPrice,
                size: dto.size,
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
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'CREATE';
        audit.createdAt = new Date();
        audit.oldData = {};
        audit.newData = Object.assign({}, dto);
        audit.recordId = product.id;
        audit.tableName = "Product";
        audit.userId = id;
        await this.auditService.addToAudit(audit);
        return (0, class_transformer_1.plainToInstance)(ProductResponseDTO_1.ProductResponseDTO, product);
    }
    async editProduct(id, dto, userId) {
        const findProduct = await this.prismaService.product.findUnique({
            where: {
                id
            }
        });
        if (!findProduct) {
            throw new common_1.NotFoundException('Product does not exist in the database');
        }
        const product = await this.prismaService.product.update({
            where: {
                id
            },
            data: {
                productName: dto.productName,
                productPrice: dto.productPrice,
                size: dto.size,
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
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'UPDATE';
        audit.createdAt = new Date();
        audit.oldData = Object.assign({}, findProduct);
        audit.newData = Object.assign({}, dto);
        audit.recordId = product.id;
        audit.tableName = "Product";
        audit.userId = userId;
        await this.auditService.addToAudit(audit);
        return (0, class_transformer_1.plainToInstance)(ProductResponseDTO_1.ProductResponseDTO, product);
    }
    async getProductById(id) {
        const findProduct = await this.prismaService.product.findUnique({
            where: {
                id
            }
        });
        if (!findProduct) {
            throw new common_1.NotFoundException('Product does not exist in the database');
        }
        return (0, class_transformer_1.plainToInstance)(ProductResponseDTO_1.ProductResponseDTO, findProduct);
    }
    async getProductDefaultImage(id) {
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
        });
        if (!findProduct) {
            throw new common_1.NotFoundException('Product does not exist in the database');
        }
        return (0, class_transformer_1.plainToInstance)(ProductResponseDTO_1.ProductResponseDTO, findProduct);
    }
    async deleteProduct(id, userId) {
        const findProduct = await this.prismaService.product.findUnique({
            where: {
                id
            }
        });
        if (!findProduct) {
            throw new common_1.NotFoundException('Product does not exist in the database');
        }
        await this.prismaService.product.delete({
            where: {
                id
            }
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'DELETE';
        audit.createdAt = new Date();
        audit.oldData = Object.assign({}, findProduct);
        audit.newData = {};
        audit.recordId = findProduct.id;
        audit.tableName = "Product";
        audit.userId = userId;
        await this.auditService.addToAudit(audit);
        return "Product Successfully Deleted";
    }
    async getAllProduct({ pageNo, pageSize, sortBy, sortDir, filterBy, filterParam, filterKey, filterValue }) {
        const orderBy = sortBy && sortDir ? { [sortBy]: sortDir } : undefined;
        let where = undefined;
        if (filterBy === 'productPrice' || filterBy === 'id' || filterBy === 'quantityAvailable') {
            filterValue = Number(filterValue);
        }
        if (filterBy && filterParam) {
            where = { [filterBy]: filterParam };
        }
        else if (filterKey && filterValue) {
            where = { [filterBy]: { [filterKey]: filterValue } };
        }
        const page = pageNo || 1;
        const size = pageSize || 20;
        const products = await this.prismaService.product.findMany({
            take: size,
            skip: (page - 1) * size,
            orderBy,
            where,
            include: {
                productImages: true
            }
        });
        const totalCount = await this.prismaService.product.count({ where });
        const result = new PaginatedProductDTO_1.PaginatedProductDTO();
        result.data = (0, class_transformer_1.plainToInstance)(ProductResponseDTO_1.ProductResponseDTO, products);
        result.filterBy = filterBy;
        result.filterParam = filterParam;
        result.sortBy = sortBy;
        result.sortDir = sortDir;
        result.pageNo = page;
        result.pageSize = size;
        result.totalPages = Math.ceil(totalCount / size);
        return result;
    }
    async getAllProductWithoutPagination() {
        const products = await this.prismaService.product.findMany({
            include: {
                productImages: true
            }
        });
        return products.map((product) => (0, class_transformer_1.plainToInstance)(ProductResponseDTO_1.ProductResponseDTO, product));
    }
    async addproductImages(file, id, dto, userId) {
        const result = await this.cloudinaryService.uploadFile(file);
        const product = await this.prismaService.product.findUnique({
            where: {
                id
            }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with that id = ${id} does not exist`);
        }
        if (!result) {
            throw new common_1.InternalServerErrorException("An error occured while uploading image to cloudinary");
        }
        if (dto.defaultImage) {
            const findDefaultImage = await this.prismaService.productImage.findFirst({
                where: {
                    AND: {
                        productId: id,
                        defaultImage: true
                    }
                }
            });
            if (findDefaultImage) {
                await this.prismaService.productImage.update({
                    where: {
                        id: findDefaultImage.id
                    },
                    data: {
                        defaultImage: false
                    }
                });
            }
        }
        const productImage = await this.prismaService.productImage.create({
            data: {
                imageUrl: result.url,
                productId: id,
                defaultImage: dto.defaultImage
            },
            select: {
                id: true,
                product: {
                    select: {
                        id: true,
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
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'CREATE';
        audit.createdAt = new Date();
        audit.oldData = {};
        audit.newData = Object.assign({}, productImage);
        audit.recordId = productImage.id;
        audit.tableName = "Product Image";
        audit.userId = userId;
        await this.auditService.addToAudit(audit);
        return (0, class_transformer_1.plainToInstance)(ProductImageResponseDTO_1.ProductImageResponseDTO, productImage);
    }
    async editProductImages(file, id, dto, userId) {
        const result = await this.cloudinaryService.uploadFile(file);
        const image = await this.prismaService.productImage.findUnique({
            where: {
                id
            }
        });
        if (!image) {
            throw new common_1.NotFoundException(`Product Image with that id = ${id} does not exist`);
        }
        if (!result) {
            throw new common_1.InternalServerErrorException("An error occured while uploading image to cloudinary");
        }
        if (dto.defaultImage) {
            const findDefaultImage = await this.prismaService.productImage.findFirst({
                where: {
                    AND: {
                        productId: id,
                        defaultImage: true
                    }
                }
            });
            if (findDefaultImage) {
                await this.prismaService.productImage.update({
                    where: {
                        id: findDefaultImage.id
                    },
                    data: {
                        defaultImage: false
                    }
                });
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
                id: true,
                product: {
                    select: {
                        id: true,
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
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'UPDATE';
        audit.createdAt = new Date();
        audit.oldData = Object.assign({}, image);
        audit.newData = Object.assign({}, productImage);
        audit.recordId = productImage.id;
        audit.tableName = "Product Image";
        audit.userId = userId;
        await this.auditService.addToAudit(audit);
        return (0, class_transformer_1.plainToInstance)(ProductImageResponseDTO_1.ProductImageResponseDTO, productImage);
    }
    async deleteProductImage(id, userId) {
        const image = await this.prismaService.productImage.findUnique({
            where: {
                id
            }
        });
        if (!image) {
            throw new common_1.NotFoundException(`Product Image with that id = ${id} does not exist`);
        }
        await this.prismaService.productImage.delete({
            where: {
                id
            }
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'DELETE';
        audit.createdAt = new Date();
        audit.oldData = Object.assign({}, image);
        audit.newData = {};
        audit.recordId = image.id;
        audit.tableName = "Product Image";
        audit.userId = userId;
        await this.auditService.addToAudit(audit);
        return "Product image deleted successfully";
    }
    async addCategory(dto, userId) {
        const findCategory = await this.prismaService.category.findUnique({
            where: {
                categoryName: dto.categoryName
            }
        });
        if (findCategory) {
            throw new common_1.ConflictException('Category Already exists');
        }
        const category = await this.prismaService.category.create({
            data: Object.assign({}, dto)
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'CREATE';
        audit.createdAt = new Date();
        audit.oldData = {};
        audit.newData = Object.assign({}, dto);
        audit.recordId = category.id;
        audit.tableName = "Category";
        audit.userId = userId;
        await this.auditService.addToAudit(audit);
        return (0, class_transformer_1.plainToInstance)(CategoryResponseDTO_1.CategoryResponseDTO, category);
    }
    async editCategory(dto, categoryId, userId) {
        const category = await this.prismaService.category.findUnique({
            where: {
                id: categoryId
            }
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const findCategory = await this.prismaService.category.findUnique({
            where: {
                categoryName: dto.categoryName
            }
        });
        if (findCategory) {
            throw new common_1.ConflictException('Category with that name already exists');
        }
        const update = await this.prismaService.category.update({
            where: {
                id: categoryId
            },
            data: {
                categoryName: dto.categoryName
            }
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'UPDATE';
        audit.createdAt = new Date();
        audit.oldData = Object.assign({}, category);
        audit.newData = Object.assign({}, dto);
        audit.recordId = update.id;
        audit.tableName = "Category";
        audit.userId = userId;
        await this.auditService.addToAudit(audit);
        return (0, class_transformer_1.plainToInstance)(CategoryResponseDTO_1.CategoryResponseDTO, update);
    }
    async getAllCategories() {
        const categories = await this.prismaService.category.findMany();
        return categories.map((category) => (0, class_transformer_1.plainToInstance)(CategoryResponseDTO_1.CategoryResponseDTO, category));
    }
    async findByCategoryName(categoryName) {
        const category = await this.prismaService.category.findUnique({
            where: {
                categoryName
            }
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return (0, class_transformer_1.plainToInstance)(CategoryResponseDTO_1.CategoryResponseDTO, category);
    }
    async deleteCategory(categoryId, userId) {
        const category = await this.prismaService.category.findUnique({
            where: {
                id: categoryId
            },
            include: {
                product: true
            }
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.product.length !== 0) {
            return "Can not delete category because some products belong to this category";
        }
        await this.prismaService.category.delete({
            where: {
                id: categoryId
            }
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'DELETE';
        audit.createdAt = new Date();
        audit.oldData = Object.assign({}, category);
        audit.newData = {};
        audit.recordId = category.id;
        audit.tableName = "Category";
        audit.userId = userId;
        await this.auditService.addToAudit(audit);
        return "Category deleted successflly";
    }
};
ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, cloudinary_service_1.CloudinaryService, audit_service_1.AuditService])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map