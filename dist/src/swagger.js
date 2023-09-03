"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('E-Commerce API')
        .setDescription('This swagger documentation contains the rest api endpoints of my e-commerce application')
        .setVersion('1.0')
        .addTag('Authentication')
        .addTag('Google Authentication')
        .addTag('Otp')
        .addTag('Coupon')
        .addTag('Admin')
        .addTag('Product')
        .addTag('Cart')
        .addTag('Orders')
        .addTag('Mail')
        .addTag('Notification')
        .addTag('Reviews')
        .addTag('Wishlist')
        .addTag('Payment')
        .addTag('Address')
        .addTag('Audit')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
}
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map