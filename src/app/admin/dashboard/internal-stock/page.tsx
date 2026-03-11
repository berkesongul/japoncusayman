"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    Warehouse,
    MapPin,
    Tag,
    ChevronUp,
    ChevronDown,
    Save,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InternalStockItem {
    id: string;
    name: string;
    oemCode: string | null;
    quantity: number;
    location: string | null;
    notes: string | null;
    updatedAt: string;
}

export default function InternalStockPage() {
    const [items, setItems] = useState<InternalStockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InternalStockItem | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        oemCode: "",
        quantity: 0,
        location: "",
        notes: ""
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async (query = "") => {
        try {
            const res = await fetch(`/api/admin/internal-stock?q=${query}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Error fetching internal stock:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchItems(searchTerm);
    };

    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormData({
            name: "",
            oemCode: "",
            quantity: 0,
            location: "",
            notes: ""
        });
        setIsFormOpen(true);
    };

    const handleEdit = (item: InternalStockItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            oemCode: item.oemCode || "",
            quantity: item.quantity,
            location: item.location || "",
            notes: item.notes || ""
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/admin/internal-stock/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setItems(items.filter(item => item.id !== id));
            }
        } catch (error) {
            alert("Silme işlemi başarısız oldu.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const url = editingItem
            ? `/api/admin/internal-stock/${editingItem.id}`
            : "/api/admin/internal-stock";
        const method = editingItem ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await fetchItems(searchTerm);
                setIsFormOpen(false);
            } else {
                alert("İşlem başarısız oldu.");
            }
        } catch (error) {
            alert("Bir hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    const updateQuantity = async (item: InternalStockItem, delta: number) => {
        const newQuantity = Math.max(0, item.quantity + delta);
        try {
            const res = await fetch(`/api/admin/internal-stock/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...item, quantity: newQuantity }),
            });
            if (res.ok) {
                setItems(items.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i));
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dükkan Stoğu</h1>
                    <p className="text-muted-foreground mt-1">Sitede listelenmeyen, dükkan içi yedek parça ve malzeme takibi.</p>
                </div>
                <Button onClick={handleOpenAdd} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Ürün Ekle
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-card p-4 rounded-xl border">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Ürün adı veya OEM kodu ile ara..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="secondary">Ara</Button>
                </form>
            </div>

            {/* Items Table */}
            <div className="bg-card rounded-xl border overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-12 text-center">
                        <Warehouse className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground">Henüz ürün eklenmemiş veya arama kriterine uygun sonuç yok.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted text-muted-foreground font-medium border-b text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Ürün Bilgisi</th>
                                    <th className="px-6 py-4">Konum</th>
                                    <th className="px-6 py-4 text-center">Miktar</th>
                                    <th className="px-6 py-4">Notlar</th>
                                    <th className="px-6 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{item.name}</div>
                                            {item.oemCode && (
                                                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                    <Tag className="h-3 w-3" />
                                                    {item.oemCode}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.location ? (
                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                                    {item.location}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">Belirtilmemiş</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item, -1)}
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                                <span className={`font-mono font-bold text-base w-8 text-center ${item.quantity <= 0 ? 'text-red-500' : ''}`}>
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item, 1)}
                                                >
                                                    <ChevronUp className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="max-w-[200px] truncate text-xs text-muted-foreground" title={item.notes || ""}>
                                                {item.notes || "-"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal / Form Overlay */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex items-center justify-between bg-muted/30">
                            <h2 className="text-xl font-bold">
                                {editingItem ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Ürün Adı *</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Örn: 10/40 Motor Yağı"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="oemCode">OEM Kodu</Label>
                                    <Input
                                        id="oemCode"
                                        value={formData.oemCode}
                                        onChange={(e) => setFormData({ ...formData, oemCode: e.target.value })}
                                        placeholder="Parça numarası..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Stok Miktarı</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="0"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Dükkan Konumu</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Örn: Arka Depo, Alt Raf"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notlar</Label>
                                <Textarea
                                    id="notes"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Ürün hakkında ek bilgiler..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>İptal</Button>
                                <Button type="submit" disabled={submitting} className="min-w-[120px]">
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {editingItem ? "Güncelle" : "Kaydet"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
