import * as dotenv from 'dotenv'
dotenv.config()
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

async function main() {
  console.log("Testing empty object...");
  try {
    const products = await prisma.product.findMany({ take: 1 })
    console.log("OK", products?.length)
  } catch (e: any) {
    console.error("FAIL", e.message || e)
  }
}
main()
