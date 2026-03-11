import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";

        const items = await (prisma as any).internalStock.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { oemCode: { contains: query, mode: "insensitive" } },
                ],
            },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Internal stock GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const item = await (prisma as any).internalStock.create({
            data: {
                name: data.name,
                oemCode: data.oemCode,
                quantity: parseInt(data.quantity) || 0,
                location: data.location,
                notes: data.notes,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Internal stock POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
