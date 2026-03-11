"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Edit2, Trash2, Loader2, Tags, Save, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Brand {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    _count: {
        models: number;
        products: number;
    };
}

export default function BrandsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        imageUrl: ""
    });

    useEffect(() => {
        fetchBrands();

        if (searchParams.get("new") === "true") {
            handleOpenAdd();
            // Clear the param after opening
            const params = new URLSearchParams(searchParams.toString());
            params.delete("new");
            router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
        }
    }, [searchParams]);

    const fetchBrands = async () => {
        try {
            const res = await fetch("/api/admin/brands");
            if (res.ok) {
                const data = await res.json();
                setBrands(data);
            }
        } catch (error) {
            console.error("Error fetching brands:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setEditingBrand(null);
        setFormData({ name: "", imageUrl: "" });
        setIsFormOpen(true);
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setFormData({ name: brand.name, imageUrl: brand.imageUrl || "" });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu markayı silmek istediğinize emin misiniz? (Markaya bağlı modeller ve ürünler olabilir)")) return;

        try {
            const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
            if (res.ok) {
                setBrands(brands.filter(b => b.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "Silme işlemi başarısız.");
            }
        } catch (error) {
            alert("Bir hata oluştu.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const url = editingBrand ? `/api/admin/brands/${editingBrand.id}` : "/api/admin/brands";
        const method = editingBrand ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await fetchBrands();
                setIsFormOpen(false);
            }
        } catch (error) {
            alert("Bir hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Markalar</h1>
                    <p className="text-muted-foreground mt-1">Araç markalarını buradan yönetebilirsiniz.</p>
                </div>
                <Button onClick={handleOpenAdd} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Marka Ekle
                </Button>
            </div>

            <div className="bg-card p-4 rounded-xl border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Marka adı ile ara..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl border" />
                    ))
                ) : filteredBrands.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        Marka bulunamadı.
                    </div>
                ) : (
                    filteredBrands.map((brand) => (
                        <div key={brand.id} className="bg-card rounded-xl border p-5 flex items-center justify-between group hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                            <div className="flex items-center gap-4">
                                {brand.imageUrl ? (
                                    <img src={brand.imageUrl} alt={brand.name} className="w-12 h-12 object-contain bg-white rounded-lg p-1 border" />
                                ) : (
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <Tags className="h-6 w-6 text-slate-400" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-slate-900">{brand.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                                            {brand._count.models} Model
                                        </span>
                                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                                            {brand._count.products} Ürün
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(brand)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(brand.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingBrand ? "Markayı Düzenle" : "Yeni Marka Ekle"}</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}><X className="h-5 w-5" /></Button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Marka Adı *</Label>
                                <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Örn: Toyota, Honda" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Logo URL</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="imageUrl" className="pl-9" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Şimdilik bir resim URL'si girin veya boş bırakın.</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>İptal</Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    {editingBrand ? "Güncelle" : "Kaydet"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
