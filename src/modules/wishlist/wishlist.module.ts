import { Module } from '@nestjs/common';
import { WishlistService } from './service/wishlist.service';
import { WishlistController } from './controller/wishlist.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
    providers: [WishlistService],
    controllers: [WishlistController],
    imports: [PrismaModule]
})
export class WishlistModule {}
