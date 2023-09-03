"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    if (await prisma.user.count() == 0) {
        const salt = await bcrypt.genSalt(10);
        await prisma.user.create({
            data: {
                username: 'admin',
                email: 'ecommerce@gmail.com',
                password: await bcrypt.hash("root@password", salt),
                isBlocked: false,
                cart: {
                    create: {
                        quantity: 0,
                        cartTotal: 0
                    }
                },
                wishlist: {
                    create: {}
                },
                role: client_2.RoleType.ADMIN,
                isVerified: true,
            }
        });
    }
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map