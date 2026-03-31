"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Folder, CornerDownRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Category = {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    children?: Category[];
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", parentId: "" });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenAdd = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ name: "", parentId: "" });
    };

    const handleOpenEdit = (category: Category) => {
        setIsEditing(true);
        setCurrentId(category.id);
        setFormData({ name: category.name, parentId: category.parentId || "" });
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`'${name}' kategorisini silmek istediğinize emin misiniz? (Alt kategoriler silinmez, ana kategori olur.)`)) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchCategories();
                if (currentId === id) handleOpenAdd(); // reset form if trying to edit deleted
            } else {
                alert("Silme işlemi başarısız oldu.");
            }
        } catch (error) {
            alert("Bir hata oluştu.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const url = isEditing && currentId 
            ? `/api/admin/categories/${currentId}` 
            : "/api/admin/categories";
            
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                handleOpenAdd(); // Reset form
                fetchCategories(); // Refresh list
            } else {
                const data = await res.json();
                alert(data.error || "İşlem başarısız.");
            }
        } catch (error) {
            alert("Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter categories to build tree structure
    // Since our API includes `children`, we can just look for top-level ones (parentId === null)
    // but the API returns ALL categories in a flat list. So we will filter top-level and map their children.
    const topLevelCategories = categories.filter(c => !c.parentId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Kategori Yönetimi</h1>
                <p className="text-muted-foreground mt-1">Ürünlerinizi düzenlemek için ana ve alt kategoriler oluşturun.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form column */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader className="py-4">
                        <CardTitle className="text-lg">{isEditing ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Kategori Adı *</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Örn: Fren Sistemi"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parentId">Üst Kategori</Label>
                                <select
                                    id="parentId"
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                >
                                    <option value="">Yeni Kategori olarak oluştur</option>
                                    {categories
                                        .filter(c => c.id !== currentId) // prevent setting as its own parent
                                        .map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))
                                    }
                                </select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Alt kategori yapmak istiyorsanız bir üst kategori seçin.
                                </p>
                            </div>

                            <div className="pt-2 flex gap-2">
                                {isEditing && (
                                    <Button type="button" variant="outline" className="flex-1" onClick={handleOpenAdd}>
                                        İptal
                                    </Button>
                                )}
                                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (isEditing ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />)}
                                    {isEditing ? "Güncelle" : "Ekle"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* List column */}
                <Card className="md:col-span-2">
                    <CardHeader className="py-4">
                        <CardTitle className="text-lg">Kategori Listesi</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground border-t">
                                Henüz kategori bulunmuyor. Sol taraftaki formu kullanarak ekleyebilirsiniz.
                            </div>
                        ) : (
                            <div className="border-t">
                                {topLevelCategories.map(category => (
                                    <div key={category.id} className="border-b last:border-0 p-4">
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <Folder className="h-5 w-5 text-blue-500" />
                                                <span className="font-semibold">{category.name}</span>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleOpenEdit(category)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(category.id, category.name)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        {/* Subcategories render */}
                                        {category.children && category.children.length > 0 && (
                                            <div className="mt-2 ml-6 space-y-1">
                                                {category.children.map(child => (
                                                    <div key={child.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 group transition-colors">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                                                            <span>{child.name}</span>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleOpenEdit(child)}>
                                                                <Pencil className="h-3 w-3" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(child.id, child.name)}>
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
