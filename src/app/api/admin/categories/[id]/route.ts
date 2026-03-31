import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { slugify } from "@/lib/utils";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { name, parentId } = body;

        const existingCategory = await prisma.category.findUnique({
            where: { id: id }
        });

        if (!existingCategory) return NextResponse.json({ error: "Category not found" }, { status: 404 });

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        // Prevent setting parent to itself
        if (parentId === id) {
            return NextResponse.json({ error: "A category cannot be its own parent" }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug: slugify(name),
                parentId: (parentId && parentId.trim() !== "") ? parentId : null,
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("Category PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error or duplicate name" }, { status: 500 });
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

        const existingCategory = await prisma.category.findUnique({
            where: { id: id }
        });

        if (!existingCategory) return NextResponse.json({ error: "Category not found" }, { status: 404 });

        // Prisma schema is configured with setNull for parentId, so deleting this category 
        // will safely detach its children. Products will also set categoryId to null.
        await prisma.category.delete({
            where: { id: existingCategory.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Category DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
