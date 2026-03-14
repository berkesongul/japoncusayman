import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { slugify } from "@/lib/utils";

export async function GET() {
    try {
        const models = await prisma.carModel.findMany({
            orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
            include: {
                brand: true,
                _count: {
                    select: { products: true }
                }
            }
        });
        return NextResponse.json(models);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { name, brandId, imageUrl } = await req.json();
        if (!name || !brandId) return NextResponse.json({ error: "Name and Brand are required" }, { status: 400 });

        const model = await prisma.carModel.create({
            data: {
                name,
                slug: slugify(name),
                brandId,
                imageUrl: imageUrl || null,
            }
        });

        return NextResponse.json(model);
    } catch (error) {
        console.error("Model POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
