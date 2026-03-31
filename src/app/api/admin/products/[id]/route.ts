import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { slugify } from "@/lib/utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findFirst({
            where: {
                OR: [
                    { id: id },
                    { slug: id }
                ]
            },
            include: {
                brand: true,
                model: true,
                category: true,
            }
        });

        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Product GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        console.log("Product PUT Body:", body);
        const { name, oemCode, manufacturer, description, price, stock, isSpecialOrder, isCampaign, imageUrl, brandId, modelId, categoryId } = body;

        // Find product first to get actual ID if slug was used
        const existingProduct = await prisma.product.findFirst({
            where: {
                OR: [{ id: id }, { slug: id }]
            }
        });

        if (!existingProduct) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        if (!name || !oemCode || !brandId) {
            return NextResponse.json({ error: "Missing required fields (name, oemCode, brandId)" }, { status: 400 });
        }

        const product = await prisma.product.update({
            where: { id: existingProduct.id },
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
        console.error("Product PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const existingProduct = await prisma.product.findFirst({
            where: {
                OR: [{ id: id }, { slug: id }]
            }
        });

        if (!existingProduct) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        await prisma.product.delete({
            where: { id: existingProduct.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Product DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
