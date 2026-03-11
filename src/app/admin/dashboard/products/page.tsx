import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Ürünler | Japoncu Sayman Yönetim",
    description: "Sistemde kayıtlı ürünler",
};

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            brand: true,
            model: true,
            category: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ürün Yönetimi</h1>
                    <p className="text-muted-foreground mt-1">Sistemdeki tüm parçaları görüntüleyin ve yönetin.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/dashboard/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Ürün Ekle
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-lg">Kayıtlı Parçalar ({products.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ürün</TableHead>
                                    <TableHead>OEM Kodu</TableHead>
                                    <TableHead>Marka / Model / Kategori</TableHead>
                                    <TableHead className="text-right">Fiyat</TableHead>
                                    <TableHead className="text-center">Stok</TableHead>
                                    <TableHead className="w-[80px] text-center">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            Gösterilecek ürün bulunamadı.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{product.name}</span>
                                                    <span className="text-xs text-muted-foreground hidden lg:block">
                                                        {product.slug}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">{product.oemCode}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="bg-blue-50/50">{product.brand?.name || "Marka Bilinmiyor"}</Badge>
                                                    {product.model && (
                                                        <Badge variant="outline" className="bg-slate-50/50">{product.model.name}</Badge>
                                                    )}
                                                    {product.category && (
                                                        <Badge variant="secondary" className="hidden lg:inline-flex">
                                                            {product.category.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {product.price ? `${product.price.toLocaleString("tr-TR")} ₺` : "-"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                                                >
                                                    {product.stock}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Menüyü aç</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/dashboard/products/${product.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" /> Düzenle
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Sil
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
