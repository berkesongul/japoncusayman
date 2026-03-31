import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { slugify } from "@/lib/utils";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                children: true,
                parent: true,
            },
            orderBy: { name: "asc" },
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { name, parentId } = body;

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug: slugify(name),
                parentId: (parentId && parentId.trim() !== "") ? parentId : null,
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("Category POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error or Duplicate Name" }, { status: 500 });
    }
}
