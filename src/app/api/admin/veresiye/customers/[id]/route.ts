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

        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                transactions: {
                    orderBy: { date: 'desc' }
                }
            }
        });

        if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

        const totalDebt = customer.transactions
            .filter(t => t.type === 'DEBT')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalPayment = customer.transactions
            .filter(t => t.type === 'PAYMENT')
            .reduce((sum, t) => sum + t.amount, 0);

        return NextResponse.json({
            ...customer,
            balance: totalDebt - totalPayment
        });
    } catch (error) {
        console.error("Customer GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { name, phone, address, notes } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const customer = await prisma.customer.update({
            where: { id },
            data: {
                name,
                phone: phone || null,
                address: address || null,
                notes: notes || null,
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error("Customer PUT Error:", error);
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

        await prisma.customer.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Customer DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
