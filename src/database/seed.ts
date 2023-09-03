import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { RoleType } from '@prisma/client';
const prisma = new PrismaClient()

async function main() {

    if(await prisma.user.count() == 0){
        const salt = await bcrypt.genSalt(10)
        await prisma.user.create({
            data: {
                username: 'admin',
                email: 'ecommerce@gmail.com',
                password: await bcrypt.hash("root@password", salt),
                isBlocked: false,
                cart: {
                    create: {
                        quantity: 0,
                        cartTotal : 0
                    }
                },
                wishlist: {
                    create: {}
                },
                role: RoleType.ADMIN,
                isVerified: true,
            }
        })
    }
      
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })