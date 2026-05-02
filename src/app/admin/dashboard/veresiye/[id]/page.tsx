"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, Phone, MapPin, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
    id: string;
    type: 'DEBT' | 'PAYMENT';
    amount: number;
    description: string | null;
    date: string;
}

interface Customer {
    id: string;
    name: string;
    phone: string | null;
    address: string | null;
    notes: string | null;
    balance: number;
    transactions: Transaction[];
}

export default function MusteriDetayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Transaction Form State
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
    const [transactionType, setTransactionType] = useState<'DEBT' | 'PAYMENT'>('DEBT');
    const [txAmount, setTxAmount] = useState("");
    const [txDesc, setTxDesc] = useState("");
    const getLocalDatetime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    const [txDate, setTxDate] = useState(getLocalDatetime());
    const [submitting, setSubmitting] = useState(false);

    const fetchCustomer = async () => {
        try {
            const res = await fetch(`/api/admin/veresiye/customers/${id}`);
            if (!res.ok) throw new Error("Müşteri bulunamadı");
            const data = await res.json();
            setCustomer(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!txAmount || isNaN(Number(txAmount))) return;

        setSubmitting(true);
        try {
            const url = editingTransactionId 
                ? `/api/admin/veresiye/transactions/${editingTransactionId}`
                : `/api/admin/veresiye/customers/${id}/transactions`;
            const method = editingTransactionId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: transactionType,
                    amount: Number(txAmount),
                    description: txDesc,
                    date: new Date(txDate).toISOString()
                })
            });

            if (!res.ok) throw new Error("İşlem kaydedilemedi");
            
            setIsTransactionModalOpen(false);
            setEditingTransactionId(null);
            setTxAmount("");
            setTxDesc("");
            setTxDate(getLocalDatetime());
            fetchCustomer(); // Refresh data
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (t: Transaction) => {
        setEditingTransactionId(t.id);
        setTransactionType(t.type);
        setTxAmount(t.amount.toString());
        setTxDesc(t.description || "");
        
        // format date for datetime-local
        const d = new Date(t.date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setTxDate(d.toISOString().slice(0, 16));
        
        setIsTransactionModalOpen(true);
    };

    const openAddModal = (type: 'DEBT' | 'PAYMENT') => {
        setEditingTransactionId(null);
        setTransactionType(type);
        setTxAmount("");
        setTxDesc("");
        setTxDate(getLocalDatetime());
        setIsTransactionModalOpen(true);
    };

    const handleDeleteTransaction = async (transactionId: string) => {
        if (!confirm("Bu hesap hareketini silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;

        try {
            const res = await fetch(`/api/admin/veresiye/transactions/${transactionId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("İşlem silinemedi");
            
            fetchCustomer(); // Refresh data
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteCustomer = async () => {
        if (!confirm("Bu müşteriyi ve tüm hesap hareketlerini silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
        
        try {
            const res = await fetch(`/api/admin/veresiye/customers/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Silinemedi");
            router.push("/admin/dashboard/veresiye");
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;
    if (error || !customer) return <div className="p-8 text-center text-rose-500">{error || "Müşteri bulunamadı."}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/admin/dashboard/veresiye"
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{customer.name}</h1>
                        <p className="text-sm text-slate-500 mt-1">Müşteri Cari Ekstresi</p>
                    </div>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDeleteCustomer} className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Müşteriyi Sil</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol Taraf: Müşteri Bilgileri & Bakiye */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                        <p className="text-sm font-medium text-slate-500 mb-2">Güncel Bakiye Durumu</p>
                        <h2 className={`text-4xl font-bold ${customer.balance > 0 ? 'text-rose-600' : customer.balance < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {customer.balance > 0 ? '+' : ''}{customer.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </h2>
                        <p className="text-xs text-slate-400 mt-2">
                            {customer.balance > 0 ? 'Müşterinin size borcu var.' : customer.balance < 0 ? 'Müşteri alacaklı durumda.' : 'Hesap kapalı (Bakiye 0).'}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">İletişim Bilgileri</h3>
                        {customer.phone && (
                            <div className="flex items-start gap-3 text-sm">
                                <Phone className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{customer.phone}</span>
                            </div>
                        )}
                        {customer.address && (
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{customer.address}</span>
                            </div>
                        )}
                        {customer.notes && (
                            <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-100">
                                <strong>Not:</strong> {customer.notes}
                            </div>
                        )}
                        {!customer.phone && !customer.address && !customer.notes && (
                            <p className="text-sm text-slate-500 italic">Ek bilgi bulunmuyor.</p>
                        )}
                    </div>
                </div>

                {/* Sağ Taraf: Hesap Hareketleri */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-slate-900">Hesap Hareketleri</h3>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                                onClick={() => openAddModal('DEBT')}
                                className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Borç Yaz
                            </Button>
                            <Button 
                                onClick={() => openAddModal('PAYMENT')}
                                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <Minus className="h-4 w-4 mr-1" /> Ödeme Al
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">Tarih</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Açıklama</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Borç (Satış)</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Alacak (Ödeme)</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right w-20">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {customer.transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                                                Henüz hesap hareketi bulunmuyor.
                                            </td>
                                        </tr>
                                    ) : (
                                        customer.transactions.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-500 whitespace-nowrap">
                                                    {new Date(t.date).toLocaleString('tr-TR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-900">
                                                    {t.description || "-"}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-right font-medium text-rose-600">
                                                    {t.type === 'DEBT' ? `${t.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺` : ''}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-right font-medium text-emerald-600">
                                                    {t.type === 'PAYMENT' ? `${t.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺` : ''}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex justify-end items-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(t)}
                                                            className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                                                            title="Düzenle"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTransaction(t.id)}
                                                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                                            title="Sil"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* İşlem Modalı */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className={`p-4 ${transactionType === 'DEBT' ? 'bg-rose-50 border-b border-rose-100' : 'bg-emerald-50 border-b border-emerald-100'}`}>
                            <h3 className={`text-lg font-bold ${transactionType === 'DEBT' ? 'text-rose-700' : 'text-emerald-700'}`}>
                                {editingTransactionId 
                                    ? (transactionType === 'DEBT' ? 'Borç / Satış Düzenle' : 'Tahsilat / Ödeme Düzenle') 
                                    : (transactionType === 'DEBT' ? 'Yeni Borç / Satış Ekle' : 'Tahsilat / Ödeme Al')}
                            </h3>
                        </div>
                        <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tutar (₺) <span className="text-rose-500">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    min="0.01"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={txAmount}
                                    onChange={e => setTxAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={txDesc}
                                    onChange={e => setTxDesc(e.target.value)}
                                    placeholder={transactionType === 'DEBT' ? 'Örn: 2 adet yağ filtresi' : 'Örn: Nakit ödeme, havale vb.'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tarih ve Saat <span className="text-rose-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={txDate}
                                    onChange={e => setTxDate(e.target.value)}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => { setIsTransactionModalOpen(false); setEditingTransactionId(null); }}>İptal</Button>
                                <Button type="submit" disabled={submitting} className={transactionType === 'DEBT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}>
                                    {submitting ? "Kaydediliyor..." : "Kaydet"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
