import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { unlink } from "fs/promises";
import { join } from "path";

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

        // If it has an image and it's an uploaded one (starts with /uploads/)
        if (existingProduct.imageUrl && existingProduct.imageUrl.startsWith("/uploads/")) {
            const filePath = join(process.cwd(), "public", existingProduct.imageUrl);
            try {
                await unlink(filePath);
                console.log(`Deleted file: ${filePath}`);
            } catch (err: any) {
                // If file doesn't exist, just log and continue
                console.error(`Could not delete file ${filePath}:`, err.message);
            }
        }

        await prisma.product.delete({
            where: { id: existingProduct.id }
        });

        return NextResponse.json({ success: true, message: "Product and image permanently deleted" });
    } catch (error) {
        console.error("Product Permanent DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
