import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const products = await prisma.product.findMany({
            where: { isDeleted: true },
            include: { brand: true, model: true },
            orderBy: { deletedAt: "desc" },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Trash GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
