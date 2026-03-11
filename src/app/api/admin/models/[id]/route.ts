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

        const { name, brandId } = await req.json();
        if (!name || !brandId) return NextResponse.json({ error: "Name and Brand are required" }, { status: 400 });

        const model = await prisma.carModel.update({
            where: { id: id },
            data: {
                name,
                slug: slugify(name),
                brandId,
            }
        });

        return NextResponse.json(model);
    } catch (error) {
        console.error("Model PUT Error:", error);
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

        await prisma.carModel.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Model DELETE Error:", error);
        return NextResponse.json({ error: "Check if model has dependent products" }, { status: 400 });
    }
}
