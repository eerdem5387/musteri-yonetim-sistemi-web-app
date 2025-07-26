const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Create sample services
    const services = await Promise.all([
        prisma.service.create({
            data: {
                name: 'Saç Kesimi',
                price: 150.0,
                description: 'Profesyonel saç kesimi hizmeti'
            }
        }),
        prisma.service.create({
            data: {
                name: 'Saç Boyama',
                price: 300.0,
                description: 'Kalıcı saç boyama hizmeti'
            }
        }),
        prisma.service.create({
            data: {
                name: 'Manikür',
                price: 100.0,
                description: 'El bakımı ve oje uygulaması'
            }
        }),
        prisma.service.create({
            data: {
                name: 'Pedikür',
                price: 120.0,
                description: 'Ayak bakımı ve oje uygulaması'
            }
        })
    ]);

    // Create sample experts
    const experts = await Promise.all([
        prisma.expert.create({
            data: {
                name: 'Ayşe Yılmaz',
                specialty: 'Saç Tasarımı',
                workDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
            }
        }),
        prisma.expert.create({
            data: {
                name: 'Fatma Demir',
                specialty: 'Saç Boyama',
                workDays: ['Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
            }
        }),
        prisma.expert.create({
            data: {
                name: 'Zeynep Kaya',
                specialty: 'El ve Ayak Bakımı',
                workDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
            }
        })
    ]);

    // Create sample customers
    const customers = await Promise.all([
        prisma.customer.create({
            data: {
                name: 'Mehmet Özkan',
                phone: '0532 123 45 67',
                email: 'mehmet@example.com'
            }
        }),
        prisma.customer.create({
            data: {
                name: 'Elif Yıldız',
                phone: '0533 987 65 43',
                email: 'elif@example.com'
            }
        }),
        prisma.customer.create({
            data: {
                name: 'Can Arslan',
                phone: '0534 555 44 33',
                email: null
            }
        })
    ]);

    console.log('Seed data created successfully!');
    console.log('Services:', services.length);
    console.log('Experts:', experts.length);
    console.log('Customers:', customers.length);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 