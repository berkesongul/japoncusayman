import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const transactions = await prisma.customerTransaction.findMany({
            where: { customerId: id },
            orderBy: { date: 'desc' }
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error("Transactions GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { type, amount, description, date } = body;

        if (!type || !amount) {
            return NextResponse.json({ error: "Type and amount are required" }, { status: 400 });
        }

        if (type !== 'DEBT' && type !== 'PAYMENT') {
            return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
        }

        const transaction = await prisma.customerTransaction.create({
            data: {
                customerId: id,
                type,
                amount: parseFloat(amount),
                description: description || null,
                date: date ? new Date(date) : new Date(),
            }
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error("Transaction POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
