import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const customers = await prisma.customer.findMany({
            include: {
                transactions: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Calculate total balance for each customer (DEBT - PAYMENT)
        const customersWithBalance = customers.map(customer => {
            const totalDebt = customer.transactions
                .filter(t => t.type === 'DEBT')
                .reduce((sum, t) => sum + t.amount, 0);
            const totalPayment = customer.transactions
                .filter(t => t.type === 'PAYMENT')
                .reduce((sum, t) => sum + t.amount, 0);
            
            return {
                ...customer,
                balance: totalDebt - totalPayment
            };
        });

        return NextResponse.json(customersWithBalance);
    } catch (error) {
        console.error("Customers GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { name, phone, address, notes } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                phone: phone || null,
                address: address || null,
                notes: notes || null,
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error("Customers POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
