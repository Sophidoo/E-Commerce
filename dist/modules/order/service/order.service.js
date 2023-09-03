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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
const prisma_service_1 = require("../../../database/prisma.service");
const address_service_1 = require("../../address/service/address.service");
const audit_service_1 = require("../../audit/service/audit.service");
const addressDTO_1 = require("../../address/dto/addressDTO");
const OrderResponsedTO_1 = require("../dto/OrderResponsedTO");
const payment_service_1 = require("./payment.service");
const MetaData_1 = require("../dto/MetaData");
const noification_service_1 = require("../../notification/service/noification.service");
const notificationDTO_1 = require("../../notification/dto/notificationDTO");
let OrderService = class OrderService {
    constructor(prismaService, audtService, addressService, paymentService, notificationService) {
        this.prismaService = prismaService;
        this.audtService = audtService;
        this.addressService = addressService;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
    }
    async viewUserOrderHistory(id, pageSize, pageNo) {
        const page = pageNo || 1;
        const size = pageSize || 20;
        const orders = await this.prismaService.order.findMany({
            where: {
                userId: id
            },
            include: {
                orderItems: true,
                payment: true
            },
            orderBy: {
                dateOrdered: "desc"
            },
            take: size,
            skip: (page - 1) * size,
        });
        return orders;
    }
    async viewAParticularOrder(orderId) {
        const findOrder = await this.prismaService.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                address: true,
                orderItems: {
                    select: {
                        product: true,
                        quantity: true,
                        subTotal: true
                    }
                },
                dateDelivered: true,
                dateOrdered: true,
                status: true,
                deliveryType: true,
                totalPrice: true,
                payment: true
            }
        });
        if (!findOrder) {
            throw new common_1.NotFoundException('Order not found');
        }
        const order = await this.prismaService.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                orderItems: true,
                payment: true,
                address: true
            }
        });
        return order;
    }
    async viewAllOrders(pageSize, pageNo) {
        const page = pageNo || 1;
        const size = pageSize || 20;
        const orders = await this.prismaService.order.findMany({
            include: {
                orderItems: true,
                payment: true,
                user: {
                    select: {
                        username: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: {
                dateOrdered: "desc"
            },
            take: size,
            skip: (page - 1) * size,
        });
        const orderResponse = new OrderResponsedTO_1.PaginatedOrderResponseDTO;
        orderResponse.data = orders;
        orderResponse.pageNo = (page - 1) * size;
        orderResponse.pageSize = size;
        return orderResponse;
    }
    async updateOrderStatus(id, dto) {
        const order = await this.prismaService.order.findUnique({
            where: {
                id
            },
            include: {
                user: {
                    select: {
                        username: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                        image: true
                    }
                }
            }
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const update = await this.prismaService.order.update({
            where: {
                id
            },
            data: {
                status: dto.orderStatus
            },
            include: {
                payment: true,
                orderItems: true
            }
        });
        if (update.status == 'CANCELLED' && update.payment.status == 'success') {
            update.orderItems.map(async (orderItem) => {
                const product = await this.prismaService.product.findUnique({
                    where: {
                        id: orderItem.productId
                    }
                });
                if (!product) {
                    throw new common_1.NotFoundException(`A product you are trying to purchase with id = ${product.id} is no longer available`);
                }
                await this.prismaService.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        quantityAvailable: product.quantityAvailable + orderItem.quantity
                    }
                });
            });
        }
        const notification = new notificationDTO_1.NotificationDTO;
        notification.isRead = false;
        notification.notificationType = "Order Status Update";
        notification.content = `Your order wit id #${update.id} has been ${update.status}`;
        await this.notificationService.sendNotificationToUser(update.userId, notification);
        return update;
    }
    async checkout(userId, dto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        console.log("User Exists");
        if (!user) {
            throw new common_1.NotFoundException('Invalid or Expired Token');
        }
        const cartItems = await this.prismaService.cartItems.findMany({
            where: {
                cartId: user.cartId
            }
        });
        console.log("Cart items retreived");
        const orderItemsData = cartItems.map(cartItem => ({
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            subTotal: cartItem.subTotal
        }));
        cartItems.map(async (cartItem) => {
            const product = await this.prismaService.product.findUnique({
                where: {
                    id: cartItem.productId
                }
            });
            if (!product) {
                throw new common_1.NotFoundException(`${product.productName} you are trying to purchase is no longer available`);
            }
            if (cartItem.quantity > product.quantityAvailable) {
                throw new common_1.BadRequestException(`${product.productName} has only ${product.quantityAvailable} available`);
            }
            if (product.isLocked) {
                throw new common_1.BadRequestException('One or more products in the order are locked.');
            }
        });
        const total = orderItemsData.reduce((total, item) => total.add(item.subTotal), new library_1.Decimal(0));
        let address;
        if (dto.useDefaultShippingAddress) {
            address = await this.addressService.getDefaultAddress(userId).catch(e => {
                throw new common_1.InternalServerErrorException(e);
            });
            console.log("Default shipping address exists");
        }
        if (!dto.useDefaultShippingAddress) {
            const createAddress = new addressDTO_1.AddressDTO;
            createAddress.city = dto.city,
                createAddress.country = dto.country,
                createAddress.state = dto.state,
                createAddress.streetAddress = dto.streetAddress,
                createAddress.isDefaultShippingAddress = false;
            address = await this.addressService.addAddress(userId, createAddress);
            console.log("Address created");
        }
        if (dto.deliveryType == 'PICKUP') {
            const order = await this.prismaService.order.create({
                data: {
                    dateOrdered: new Date(),
                    deliveryType: dto.deliveryType,
                    status: 'PENDING',
                    userId: userId,
                    totalPrice: total,
                    orderItems: {
                        createMany: {
                            data: orderItemsData
                        }
                    }
                }
            });
            return order;
        }
        const order = await this.prismaService.order.create({
            data: {
                dateOrdered: new Date(),
                deliveryType: dto.deliveryType,
                status: 'PENDING',
                userId: userId,
                totalPrice: total,
                orderItems: {
                    createMany: {
                        data: orderItemsData
                    }
                },
                addressId: address.id
            },
            include: {
                address: true,
                user: {
                    select: {
                        image: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                        username: true
                    }
                }
            }
        });
        const metadata = new MetaData_1.Metadata;
        metadata.amount = order.totalPrice,
            metadata.orderId = order.id;
        return order;
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService, address_service_1.AddressService, payment_service_1.PaymentService, noification_service_1.NoificationService])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map