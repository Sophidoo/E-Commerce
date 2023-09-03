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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const PaginatedWishListDTO_1 = require("../dto/PaginatedWishListDTO");
let WishlistService = class WishlistService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async addToWishList(productId, userId) {
        const product = await this.prismaService.product.findUnique({
            where: {
                id: productId
            }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with id = ${productId} not found`);
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id = ${userId} not found`);
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
        });
        if (findProductInWishList) {
            return "Product already exists in wishlist";
        }
        await this.prismaService.wishList.update({
            where: {
                id: user.wishlistId
            },
            data: {
                product: {
                    connect: {
                        id: product.id
                    }
                }
            }
        });
        return "Product added to wishlist";
    }
    async removeFromWishList(productId, userId) {
        const product = await this.prismaService.product.findUnique({
            where: {
                id: productId
            }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with id = ${productId} not found`);
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id = ${userId} not found`);
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
        });
        if (!findProductInWishList) {
            return "Product does not exists in wishlist";
        }
        await this.prismaService.wishList.update({
            where: {
                id: user.wishlistId
            },
            data: {
                product: {
                    disconnect: {
                        id: product.id
                    }
                }
            }
        });
        return "Product removed from wishlist";
    }
    async viewAllInWishlist({ pageNo, pageSize, sortBy, sortDir, filterParam }, id) {
        const orderBy = sortBy && sortDir ? { [sortBy]: sortDir } : undefined;
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        const page = pageNo || 1;
        const size = pageSize || 20;
        const wishlistProducts = await this.prismaService.wishList.findUnique({
            where: {
                id: user.wishlistId
            },
            select: {
                id: true,
                product: {
                    take: size,
                    skip: (page - 1) * size,
                    orderBy,
                    where: {
                        productName: {
                            contains: filterParam
                        }
                    },
                    select: {
                        id: true,
                        productName: true,
                        productImages: {
                            select: {
                                imageUrl: true
                            }
                        },
                        productPrice: true,
                        quantityAvailable: true,
                        brand: true,
                        size: true,
                        description: true,
                        category: {
                            select: {
                                categoryName: true
                            }
                        },
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });
        const totalCount = await this.prismaService.wishList.findUnique({
            where: {
                id: user.wishlistId
            },
        }).product();
        const result = new PaginatedWishListDTO_1.PaginatedWishlistDTO();
        result.data = wishlistProducts;
        result.filterBy = "Product Name";
        result.filterParam = filterParam;
        result.sortBy = sortBy;
        result.sortDir = sortDir;
        result.pageNo = page;
        result.pageSize = size;
        result.totalPages = Math.ceil(totalCount.length / size);
        return result;
    }
};
WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
exports.WishlistService = WishlistService;
//# sourceMappingURL=wishlist.service.js.map