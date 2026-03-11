import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { slugify } from "@/lib/utils";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                brand: true,
                model: true,
                category: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        console.log("Product POST Body:", body);
        const { name, oemCode, description, price, stock, imageUrl, brandId, modelId, categoryId } = body;

        if (!name || !oemCode || !brandId || !categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug: slugify(name + "-" + oemCode),
                oemCode,
                description,
                price: price ? parseFloat(price) : null,
                stock: parseInt(stock) || 0,
                imageUrl,
                brandId,
                modelId: modelId || null,
                categoryId,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Product POST Error Details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
