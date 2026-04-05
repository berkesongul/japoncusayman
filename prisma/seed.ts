import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Initialize Postgres Pool and Prisma Adapter
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    // Create Default Admin User
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminPasswordHtml = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.adminUser.upsert({
        where: { email: "admin@japoncusayman.com" },
        update: { password: adminPasswordHtml },
        create: {
            email: "admin@japoncusayman.com",
            password: adminPasswordHtml,
        },
    });

    console.log(`👤 Default admin created: admin@japoncusayman.com / (password from .env)`);

    // Create Brands
    const toyota = await prisma.brand.upsert({
        where: { slug: "toyota" },
        update: {},
        create: { name: "Toyota", slug: "toyota" },
    });

    const honda = await prisma.brand.upsert({
        where: { slug: "honda" },
        update: {},
        create: { name: "Honda", slug: "honda" },
    });

    const nissan = await prisma.brand.upsert({
        where: { slug: "nissan" },
        update: {},
        create: { name: "Nissan", slug: "nissan" },
    });

    const mazda = await prisma.brand.upsert({
        where: { slug: "mazda" },
        update: {},
        create: { name: "Mazda", slug: "mazda" },
    });

    const mitsubishi = await prisma.brand.upsert({
        where: { slug: "mitsubishi" },
        update: {},
        create: { name: "Mitsubishi", slug: "mitsubishi" },
    });

    // Create Car Models
    const corolla = await prisma.carModel.upsert({
        where: { slug: "toyota-corolla" },
        update: {},
        create: { name: "Corolla", slug: "toyota-corolla", brandId: toyota.id },
    });

    const camry = await prisma.carModel.upsert({
        where: { slug: "toyota-camry" },
        update: {},
        create: { name: "Camry", slug: "toyota-camry", brandId: toyota.id },
    });

    const civic = await prisma.carModel.upsert({
        where: { slug: "honda-civic" },
        update: {},
        create: { name: "Civic", slug: "honda-civic", brandId: honda.id },
    });

    const xtrail = await prisma.carModel.upsert({
        where: { slug: "nissan-xtrail" },
        update: {},
        create: { name: "X-Trail", slug: "nissan-xtrail", brandId: nissan.id },
    });

    const cx5 = await prisma.carModel.upsert({
        where: { slug: "mazda-cx5" },
        update: {},
        create: { name: "CX-5", slug: "mazda-cx5", brandId: mazda.id },
    });

    const outlander = await prisma.carModel.upsert({
        where: { slug: "mitsubishi-outlander" },
        update: {},
        create: { name: "Outlander", slug: "mitsubishi-outlander", brandId: mitsubishi.id },
    });

    // Create Categories
    const motor = await prisma.category.upsert({
        where: { slug: "motor-parcalari" },
        update: {},
        create: { name: "Motor Parçaları", slug: "motor-parcalari" },
    });

    const fren = await prisma.category.upsert({
        where: { slug: "fren-sistemi" },
        update: {},
        create: { name: "Fren Sistemi", slug: "fren-sistemi" },
    });

    const suspansiyon = await prisma.category.upsert({
        where: { slug: "suspansiyon" },
        update: {},
        create: { name: "Süspansiyon", slug: "suspansiyon" },
    });

    // Create Productss
    const products = [
        {
            name: "Toyota Corolla Fren Balatası Ön",
            slug: "toyota-corolla-fren-balatasi-on",
            oemCode: "04465-02220",
            description: "Toyota Corolla 2014-2019 modelleri için orijinal ön fren balatası seti.",
            price: 1250,
            stock: 15,
            brandId: toyota.id,
            modelId: corolla.id,
            categoryId: fren.id,
        },
        {
            name: "Toyota Camry Yağ Filtresi",
            slug: "toyota-camry-yag-filtresi",
            oemCode: "04152-YZZA1",
            description: "Toyota Camry 2017+ modelleri için orijinal yağ filtresi.",
            price: 320,
            stock: 30,
            brandId: toyota.id,
            modelId: camry.id,
            categoryId: motor.id,
        },
        {
            name: "Honda Civic Amortisör Ön Sol",
            slug: "honda-civic-amortisor-on-sol",
            oemCode: "51611-TGG-A02",
            description: "Honda Civic FC 2016-2021 ön sol amortisör.",
            price: 3800,
            stock: 8,
            brandId: honda.id,
            modelId: civic.id,
            categoryId: suspansiyon.id,
        },
        {
            name: "Nissan X-Trail Hava Filtresi",
            slug: "nissan-xtrail-hava-filtresi",
            oemCode: "16546-4BA1B",
            description: "Nissan X-Trail T32 2014+ modelleri için hava filtresi.",
            price: 480,
            stock: 20,
            brandId: nissan.id,
            modelId: xtrail.id,
            categoryId: motor.id,
        },
        {
            name: "Mazda CX-5 Fren Diski Ön",
            slug: "mazda-cx5-fren-diski-on",
            oemCode: "K011-33-251A",
            description: "Mazda CX-5 2017+ ön fren diski.",
            price: 2100,
            stock: 12,
            brandId: mazda.id,
            modelId: cx5.id,
            categoryId: fren.id,
        },
        {
            name: "Mitsubishi Outlander Rot Başı",
            slug: "mitsubishi-outlander-rot-basi",
            oemCode: "4422A002",
            description: "Mitsubishi Outlander 2013+ rot başı.",
            price: 650,
            stock: 25,
            brandId: mitsubishi.id,
            modelId: outlander.id,
            categoryId: suspansiyon.id,
        },
        {
            name: "Toyota Corolla Triger Seti",
            slug: "toyota-corolla-triger-seti",
            oemCode: "13568-09130",
            description: "Toyota Corolla 1.6 motor triger seti (kayış + gergi).",
            price: 1800,
            stock: 10,
            brandId: toyota.id,
            modelId: corolla.id,
            categoryId: motor.id,
        },
        {
            name: "Honda Civic Fren Balatası Arka",
            slug: "honda-civic-fren-balatasi-arka",
            oemCode: "43022-TEA-A00",
            description: "Honda Civic FC arka fren balatası seti.",
            price: 980,
            stock: 18,
            brandId: honda.id,
            modelId: civic.id,
            categoryId: fren.id,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }

    console.log("✅ Seed data created successfully!");
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
