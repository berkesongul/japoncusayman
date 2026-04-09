import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(
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

        const product = await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
                isDeleted: false,
                deletedAt: null
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Product Restore Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
