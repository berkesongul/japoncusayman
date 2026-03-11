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

        const { name, imageUrl } = await req.json();
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const brand = await prisma.brand.update({
            where: { id: id },
            data: {
                name,
                slug: slugify(name),
                imageUrl: imageUrl || null,
            }
        });

        return NextResponse.json(brand);
    } catch (error) {
        console.error("Brand PUT Error:", error);
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

        await prisma.brand.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Brand DELETE Error:", error);
        return NextResponse.json({ error: "Check if brand has dependent models or products" }, { status: 400 });
    }
}
