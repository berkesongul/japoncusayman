"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface Brand {
    id: string;
    name: string;
}

interface Model {
    id: string;
    name: string;
    brandId: string;
}

interface Category {
    id: string;
    name: string;
    parentId?: string | null;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        oemCode: "",
        manufacturer: "",
        description: "",
        price: "",
        stock: "0",
        isSpecialOrder: false,
        isCampaign: false,
        imageUrl: "",
        brandId: "",
        modelId: "",
        categoryId: ""
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: uploadData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            } else {
                const data = await res.json();
                alert(data.error || "Yükleme başarısız oldu.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bRes, mRes, cRes, pRes] = await Promise.all([
                    fetch("/api/admin/brands"),
                    fetch("/api/admin/models"),
                    fetch("/api/admin/categories"),
                    fetch(`/api/admin/products/${productId}`)
                ]);

                if (bRes.ok) setBrands(await bRes.json());
                if (mRes.ok) setModels(await mRes.json());
                if (cRes.ok) setCategories(await cRes.json());

                if (pRes.ok) {
                    const p = await pRes.json();
                    setFormData({
                        name: p.name || "",
                        oemCode: p.oemCode || "",
                        manufacturer: p.manufacturer || "",
                        description: p.description || "",
                        price: p.price?.toString() || "",
                        stock: p.stock?.toString() || "0",
                        isSpecialOrder: p.isSpecialOrder || false,
                        isCampaign: p.isCampaign || false,
                        imageUrl: p.imageUrl || "",
                        brandId: p.brandId || "",
                        modelId: p.modelId || "",
                        categoryId: p.categoryId || ""
                    });
                } else {
                    alert("Ürün bulunamadı.");
                    router.push("/admin/dashboard/products");
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [productId, router]);

    const filteredModels = models.filter(m => m.brandId === formData.brandId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/dashboard/products");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Bir hata oluştu.");
            }
        } catch (error) {
            alert("Sunucuya bağlanılamadı.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/admin/dashboard/products");
                router.refresh();
            } else {
                alert("Silme işlemi başarısız.");
            }
        } catch (error) {
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/dashboard/products">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ürünü Düzenle</h1>
                        <p className="text-muted-foreground">Ürün bilgilerini güncelleyin veya ürünü silin.</p>
                    </div>
                </div>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete} disabled={loading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Ürünü Sil
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">Temel Bilgiler</h2>
                        <div className="space-y-2">
                            <Label htmlFor="name">Ürün Adı *</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Örn: Ön Fren Balatası"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="oemCode">OEM Kodu *</Label>
                            <Input
                                id="oemCode"
                                required
                                value={formData.oemCode}
                                onChange={(e) => setFormData({ ...formData, oemCode: e.target.value })}
                                placeholder="Örn: 04465-02220"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="manufacturer">Parça Üretici Markası</Label>
                            <Input
                                id="manufacturer"
                                value={formData.manufacturer}
                                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                                placeholder="Örn: Bosch, Valeo, Orjinal..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea
                                id="description"
                                className="min-h-[120px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ürün detaylarını buraya yazın..."
                            />
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">Stok ve Fiyat</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Fiyat (₺)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stok Adedi</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    placeholder="0"
                                    disabled={formData.isSpecialOrder}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 mt-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isSpecialOrder"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                    checked={formData.isSpecialOrder}
                                    onChange={(e) => setFormData({ ...formData, isSpecialOrder: e.target.checked })}
                                />
                                <Label htmlFor="isSpecialOrder" className="font-normal cursor-pointer">
                                    Bu bir "Özel Sipariş" (stok harici) ürünüdür.
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isCampaign"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                    checked={formData.isCampaign}
                                    onChange={(e) => setFormData({ ...formData, isCampaign: e.target.checked })}
                                />
                                <Label htmlFor="isCampaign" className="font-normal cursor-pointer font-medium text-amber-600">
                                    Kampanyalı Ürün (Fırsat reyonunda çıkar)
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">Kategorizasyon</h2>
                        <div className="space-y-2">
                            <Label htmlFor="brandId">Marka *</Label>
                            <select
                                id="brandId"
                                required
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.brandId}
                                onChange={(e) => setFormData({ ...formData, brandId: e.target.value, modelId: "" })}
                            >
                                <option value="" disabled>Marka Seçin</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="modelId">Model</Label>
                            <select
                                id="modelId"
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.modelId}
                                onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                                disabled={!formData.brandId}
                            >
                                <option value="">Tüm Modeller (veya Model Seçin)</option>
                                {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Kategori *</Label>
                            <select
                                id="categoryId"
                                required
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                <option value="" disabled>Kategori Seçin</option>
                                {categories.filter(c => !c.parentId).map(parent => (
                                    <optgroup key={parent.id} label={parent.name}>
                                        <option value={parent.id}>{parent.name} (Ana Kategori)</option>
                                        {categories.filter(c => c.parentId === parent.id).map(child => (
                                            <option key={child.id} value={child.id}>— {child.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">Görsel</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Ürün Görseli</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="imageUrl"
                                            className="pl-9"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            placeholder="URL veya dosya yükleyin"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            disabled={uploading}
                                        />
                                        <Button type="button" variant="outline" disabled={uploading} size="icon">
                                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Logo URL'si girebilir veya artı (+) butonuna basarak dosya yükleyebilirsiniz.</p>
                            </div>

                            <div className="relative aspect-video w-full bg-slate-50 border rounded-lg flex items-center justify-center overflow-hidden group">
                                {formData.imageUrl ? (
                                    <>
                                        <img src={formData.imageUrl} alt="Önizleme" className="max-w-full max-h-full object-contain p-2" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: "" })}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <ImageIcon className="h-10 w-10 text-slate-300 mx-auto" />
                                        <p className="text-xs text-slate-400 mt-2">Resim önizlemesi burada görünecek</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" className="flex-1" asChild>
                            <Link href="/admin/dashboard/products">İptal</Link>
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Değişiklikleri Kaydet
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
