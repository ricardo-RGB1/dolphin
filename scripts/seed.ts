const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient(); // instantiate PrismaClient

async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: 'Computer Science'},
                {name: 'Philosophy'},
                {name: 'Mathematics'},
                {name: 'Art'},
                {name: 'History'},
                {name: 'Photography'},
                {name: 'Economics'},
                {name: 'Biology'},
            ]
        });
        console.log("Categories seeded successfully");
    } catch (error) {
        console.log("Error seeding the categories: ", error);
    } finally {
        await database.$disconnect(); // disconnect PrismaClient
    }
}

main(); // run the main function