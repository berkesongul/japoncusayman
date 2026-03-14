"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Edit2, Trash2, Loader2, Car, Save, X, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Brand {
    id: string;
    name: string;
}

interface Model {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    brandId: string;
    brand: Brand;
    _count: {
        products: number;
    };
}

export default function ModelsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [models, setModels] = useState<Model[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<Model | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        brandId: "",
        imageUrl: ""
    });

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
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
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && brands.length > 0 && searchParams.get("new") === "true") {
            handleOpenAdd();
            const params = new URLSearchParams(searchParams.toString());
            params.delete("new");
            router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
        }
    }, [loading, brands, searchParams]);

    const fetchData = async () => {
        try {
            const [modelsRes, brandsRes] = await Promise.all([
                fetch("/api/admin/models"),
                fetch("/api/admin/brands")
            ]);

            if (modelsRes.ok && brandsRes.ok) {
                const modelsData = await modelsRes.json();
                const brandsData = await brandsRes.json();
                setModels(modelsData);
                setBrands(brandsData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setEditingModel(null);
        setFormData({ name: "", brandId: brands[0]?.id || "", imageUrl: "" });
        setIsFormOpen(true);
    };

    const handleEdit = (model: Model) => {
        setEditingModel(model);
        setFormData({ name: model.name, brandId: model.brandId, imageUrl: model.imageUrl || "" });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu modeli silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/admin/models/${id}`, { method: "DELETE" });
            if (res.ok) {
                setModels(models.filter(m => m.id !== id));
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

        const url = editingModel ? `/api/admin/models/${editingModel.id}` : "/api/admin/models";
        const method = editingModel ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await fetchData();
                setIsFormOpen(false);
            }
        } catch (error) {
            alert("Bir hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredModels = models.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Modeller</h1>
                    <p className="text-muted-foreground mt-1">Araç modellerini ve ait oldukları markaları yönetin.</p>
                </div>
                <Button onClick={handleOpenAdd} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Model Ekle
                </Button>
            </div>

            <div className="bg-card p-4 rounded-xl border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Model veya marka adı ile ara..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card rounded-xl border overflow-hidden">
                {loading ? (
                    <div className="p-12 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : filteredModels.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground font-medium">
                        Model bulunamadı.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b">
                                <tr>
                                    <th className="px-6 py-4">Marka / Model</th>
                                    <th className="px-6 py-4">Sitedeki Ürünler</th>
                                    <th className="px-6 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredModels.map((model) => (
                                    <tr key={model.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {model.imageUrl ? (
                                                    <img src={model.imageUrl} alt={model.name} className="w-10 h-10 object-contain bg-white rounded border p-0.5" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                                                        <Car className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-500">{model.brand.name}</span>
                                                    <ChevronRight className="h-3 w-3 text-slate-300" />
                                                    <span className="font-bold text-slate-900 text-base">{model.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {model._count.products} Ürün
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(model)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(model.id)}>
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

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingModel ? "Modeli Düzenle" : "Yeni Model Ekle"}</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}><X className="h-5 w-5" /></Button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="brandId">Marka *</Label>
                                <select
                                    id="brandId"
                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.brandId}
                                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Marka seçin...</option>
                                    {brands.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Model Adı *</Label>
                                <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Örn: Corolla, Civic" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Model Görseli</Label>
                                <div className="space-y-3">
                                    {formData.imageUrl && (
                                        <div className="relative w-24 h-24 border rounded-lg overflow-hidden bg-white">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg hover:bg-red-600 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input id="imageUrl" className="pl-9" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="URL veya dosya yükleyin" />
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
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>İptal</Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    {editingModel ? "Güncelle" : "Kaydet"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
