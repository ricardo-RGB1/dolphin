const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient(); // instantiate PrismaClient

async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: 'Music'},
                {name: 'Photography'},
                {name: 'Fitness'},
                {name: 'Accounting'},
                {name: 'Computer Science'},
                {name: 'Filming'},
                {name: 'Engineering'},
                {name: "Marketing"},
            ],
        });
        console.log("Categories seeded successfully");
    } catch (error) {
        console.log("Error seeding the categories: ", error);
    } finally {
        await database.$disconnect(); // disconnect PrismaClient
    }
}

main(); // run the main function