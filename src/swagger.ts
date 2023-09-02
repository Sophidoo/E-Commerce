import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('This swagger documentation contains the rest api endpoints of my e-commerce application')
    .setVersion('1.0')
    .addTag('Authentication') // Add tags for your controllers
    .addTag('Google Authentication') // Add tags for your controllers
    .addTag('Otp') // Add tags for your controllers
    .addTag('Coupon') // Add tags for your controllers
    .addTag('Admin') // Add tags for your controllers
    .addTag('Product') // Add tags for your controllers
    .addTag('Cart') // Add tags for your controllers
    .addTag('Orders') // Add tags for your controllers
    .addTag('Mail') // Add tags for your controllers
    .addTag('Notification') // Add tags for your controllers
    .addTag('Reviews') // Add tags for your controllers
    .addTag('Wishlist') // Add tags for your controllers
    .addTag('Payment') // Add tags for your controllers
    .addTag('Address') // Add tags for your controllers
    .addTag('Audit') // Add tags for your controllers
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}