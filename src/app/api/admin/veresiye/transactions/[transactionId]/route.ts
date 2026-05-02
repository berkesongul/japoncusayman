import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ transactionId: string }> }
) {
    try {
        const { transactionId } = await params;
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { type, amount, description, date } = body;

        if (!type || !amount || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const transaction = await prisma.customerTransaction.update({
            where: { id: transactionId },
            data: {
                type,
                amount: Number(amount),
                description: description || null,
                date: new Date(date)
            }
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error("Transaction PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
