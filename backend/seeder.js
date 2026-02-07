const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const users = require('./data/users');
const products = require('./data/products');

dotenv.config();

const prisma = new PrismaClient();

const importData = async () => {
    try {
        // Clean up existing data
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.product.deleteMany();
        await prisma.user.deleteMany();

        console.log('Old data cleared.');

        // Create users
        const createdUsers = [];
        for (const user of users) {
            const createdUser = await prisma.user.create({
                data: user,
            });
            createdUsers.push(createdUser);
        }

        const adminUser = createdUsers[0].id;

        // Create products
        const sampleProducts = products.map((product) => {
            return { ...product, userId: adminUser };
        });

        for (const product of sampleProducts) {
            await prisma.product.create({
                data: product,
            });
        }

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.product.deleteMany();
        await prisma.user.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
