"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MapPin, Search } from "lucide-react";

interface CustomerWithBalance {
    id: string;
    name: string;
    phone: string | null;
    address: string | null;
    notes: string | null;
    balance: number;
}

export function CustomerListClient({ initialCustomers }: { initialCustomers: CustomerWithBalance[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCustomers = initialCustomers.filter((customer) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            customer.name.toLowerCase().includes(query) ||
            (customer.phone && customer.phone.includes(query)) ||
            (customer.notes && customer.notes.toLowerCase().includes(query))
        );
    });

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Müşteri adı, telefon veya notlarda ara..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-4 px-6 text-sm font-semibold text-slate-600">Müşteri Adı</th>
                            <th className="py-4 px-6 text-sm font-semibold text-slate-600">Telefon</th>
                            <th className="py-4 px-6 text-sm font-semibold text-slate-600">Adres Bilgisi</th>
                            <th className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">Güncel Bakiye (Borç)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-slate-500">
                                    {searchQuery ? "Aramanıza uygun müşteri bulunamadı." : "Henüz müşteri kaydı bulunmuyor."}
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <Link href={`/admin/dashboard/veresiye/${customer.id}`} className="block">
                                            <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {customer.name}
                                            </div>
                                            {customer.notes && (
                                                <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{customer.notes}</div>
                                            )}
                                        </Link>
                                    </td>
                                    <td className="py-4 px-6">
                                        {customer.phone ? (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone className="h-4 w-4 text-slate-400" />
                                                {customer.phone}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        {customer.address ? (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                <span className="truncate max-w-[200px] block">{customer.address}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <Link href={`/admin/dashboard/veresiye/${customer.id}`} className="block">
                                            <span className={`inline-flex font-semibold text-lg ${customer.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                {customer.balance > 0 ? '+' : ''}{customer.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                            </span>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
