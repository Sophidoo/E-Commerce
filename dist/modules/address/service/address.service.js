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
exports.AddressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const AddressResponseDTO_1 = require("../dto/AddressResponseDTO");
const class_transformer_1 = require("class-transformer");
let AddressService = class AddressService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async addAddress(id, dto) {
        const previousDefaultAddress = await this.prismaService.address.findFirst({
            where: {
                isDefaultShippingAddress: true
            }
        });
        if (dto.isDefaultShippingAddress && previousDefaultAddress) {
            await this.prismaService.address.update({
                where: {
                    id: previousDefaultAddress.id
                },
                data: {
                    isDefaultShippingAddress: false
                }
            });
        }
        const address = await this.prismaService.address.create({
            data: {
                streetAddress: dto.streetAddress,
                city: dto.city,
                state: dto.state,
                country: dto.country,
                isDefaultShippingAddress: dto.isDefaultShippingAddress,
                userId: id
            }
        });
        return (0, class_transformer_1.plainToInstance)(AddressResponseDTO_1.AddressResponseDTO, address);
    }
    async editAddress(addressId, dto) {
        const address = await this.prismaService.address.update({
            where: {
                id: addressId
            },
            data: Object.assign({}, dto)
        });
        return (0, class_transformer_1.plainToInstance)(AddressResponseDTO_1.AddressResponseDTO, address);
    }
    async getAllUserAddresses(id) {
        const address = await this.prismaService.address.findMany({
            where: {
                userId: id
            },
            select: {
                streetAddress: true,
                city: true,
                state: true,
                country: true,
                isDefaultShippingAddress: true
            }
        });
        return address.map((address) => (0, class_transformer_1.plainToInstance)(AddressResponseDTO_1.AddressResponseDTO, address));
    }
    async getDefaultAddress(id) {
        const address = await this.prismaService.address.findFirst({
            where: {
                AND: {
                    userId: id,
                    isDefaultShippingAddress: true
                }
            },
            select: {
                id: true,
                streetAddress: true,
                city: true,
                state: true,
                country: true,
                isDefaultShippingAddress: true
            }
        });
        if (!address) {
            throw new common_1.NotFoundException("User have no default address");
        }
        return (0, class_transformer_1.plainToInstance)(AddressResponseDTO_1.AddressResponseDTO, address);
    }
    async deleteAddress(addressId) {
        const address = await this.prismaService.address.findUnique({
            where: {
                id: addressId
            }
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        await this.prismaService.address.delete({
            where: {
                id: addressId
            }
        });
        return "Address deleted successfully";
    }
};
AddressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AddressService);
exports.AddressService = AddressService;
//# sourceMappingURL=address.service.js.map