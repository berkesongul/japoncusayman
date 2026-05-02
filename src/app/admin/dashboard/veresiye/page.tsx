import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { CustomerListClient } from "./CustomerListClient";

export const dynamic = "force-dynamic";

export default async function VeresiyePage() {
    const customers = await prisma.customer.findMany({
        include: {
            transactions: true
        },
        orderBy: {
            name: 'asc'
        }
    });

    // Calculate balances
    let globalTotalDebt = 0;
    let globalTotalPayment = 0;

    const customersWithBalance = customers.map(customer => {
        const totalDebt = customer.transactions
            .filter(t => t.type === 'DEBT')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalPayment = customer.transactions
            .filter(t => t.type === 'PAYMENT')
            .reduce((sum, t) => sum + t.amount, 0);
        
        globalTotalDebt += totalDebt;
        globalTotalPayment += totalPayment;

        return {
            ...customer,
            balance: totalDebt - totalPayment
        };
    });

    const totalReceivables = globalTotalDebt - globalTotalPayment;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Veresiye Defteri</h1>
                    <p className="text-slate-500 mt-1">Müşteri cari hesaplarını ve veresiye bakiyelerini yönetin.</p>
                </div>
                <Link 
                    href="/admin/dashboard/veresiye/yeni" 
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Yeni Müşteri Ekle
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Toplam Müşteri</p>
                            <h3 className="text-xl font-bold text-slate-900">{customers.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                            <div className="font-bold text-xl">+</div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Toplam Borç (Satış)</p>
                            <h3 className="text-xl font-bold text-rose-600">
                                ₺{globalTotalDebt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            <div className="font-bold text-xl">-</div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Toplam Ödeme</p>
                            <h3 className="text-xl font-bold text-emerald-600">
                                ₺{globalTotalPayment.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <div className="font-bold text-xl">₺</div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Açık Hesap (Bakiye)</p>
                            <h3 className="text-xl font-bold text-slate-900">
                                ₺{totalReceivables.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <CustomerListClient initialCustomers={customersWithBalance} />
        </div>
    );
}
