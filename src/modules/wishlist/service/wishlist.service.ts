import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WishlistService {
    constructor(private readonly prismaService: PrismaService){}

    async addToWishList(){
        
    }

    async removeFromWishList(){

    }

    async viewAllWishList(){
        
    }


}
