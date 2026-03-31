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
        const { name, oemCode, manufacturer, description, price, stock, isSpecialOrder, isCampaign, imageUrl, brandId, modelId, categoryId } = body;

        if (!name || !oemCode || !brandId) {
            return NextResponse.json({ error: "Missing required fields (name, oemCode, brandId)" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug: slugify(name + "-" + oemCode),
                oemCode,
                manufacturer: (manufacturer && manufacturer.trim() !== "") ? manufacturer : null,
                description,
                price: price && !isNaN(parseFloat(price)) ? parseFloat(price) : null,
                stock: stock && !isNaN(parseInt(stock)) ? parseInt(stock) : 0,
                isSpecialOrder: Boolean(isSpecialOrder),
                isCampaign: Boolean(isCampaign),
                imageUrl,
                brandId,
                modelId: (modelId && modelId.trim() !== "") ? modelId : null,
                categoryId: (categoryId && categoryId.trim() !== "") ? categoryId : null,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Product POST Error Details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
