import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { slugify } from "@/lib/utils";

export async function GET() {
    try {
        const brands = await prisma.brand.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { models: true, products: true }
                }
            }
        });
        return NextResponse.json(brands);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { name, imageUrl } = await req.json();
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const brand = await prisma.brand.create({
            data: {
                name,
                slug: slugify(name),
                imageUrl: imageUrl || null,
            }
        });

        return NextResponse.json(brand);
    } catch (error) {
        console.error("Brand POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
