import * as dotenv from 'dotenv'
dotenv.config()
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL)
  console.log("Testing FindMany Product...");
  try {
    const products = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { brand: true, model: true },
    })
    console.log("product.findMany OK", products?.length)
  } catch (e: any) {
    console.error("product.findMany FAIL", e.code, e.meta, e.message)
  }

  await prisma.$disconnect()
}

main().catch(console.error)
