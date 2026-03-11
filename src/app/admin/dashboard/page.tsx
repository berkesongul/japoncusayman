import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tags, Car, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Dashboard | Japoncu Sayman Yönetim",
    description: "Japoncu Sayman yönetim paneli",
};

export default async function DashboardPage() {
    const [productCount, brandCount, modelCount, recentProducts] = await Promise.all([
        prisma.product.count(),
        prisma.brand.count(),
        prisma.carModel.count(),
        prisma.product.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { brand: true, model: true },
        }),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
                <p className="text-muted-foreground">İşletmenizin genel durumunu buradan takip edebilirsiniz.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Metric Cards */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Sistemdeki aktif ürün sayısı</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Markalar</CardTitle>
                        <Tags className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{brandCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Tanımlı araç markası</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Modeller</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{modelCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Uyumlu araç modeli</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
                <Card className="col-span-full xl:col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Son Eklenen Ürünler</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Kataloğa dahil olan en yeni {recentProducts.length} parça</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/dashboard/products">
                                Tümünü Gör
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentProducts.map((product) => (
                                <div key={product.id} className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg border">
                                    <div className="h-10 w-10 bg-slate-200 rounded flex items-center justify-center shrink-0 overflow-hidden relative">
                                        {/* Placeholder image for admin UI */}
                                        <span className="text-[10px] text-slate-500">Img</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-none truncate">{product.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                            {product.brand?.name} - {product.oemCode}
                                        </p>
                                    </div>
                                    <div className="text-right whitespace-nowrap hidden sm:block">
                                        <p className="text-sm font-medium">{product.price ? `${product.price.toLocaleString("tr-TR")} ₺` : "Fiyat Yok"}</p>
                                        <p className={`text-xs mt-1 ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}>
                                            Stok: {product.stock}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentProducts.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground text-sm">Hiç ürün bulunamadı.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions (Future Expansion) */}
                <Card className="col-span-full xl:col-span-3">
                    <CardHeader>
                        <CardTitle>Hızlı İşlemler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-between" asChild>
                            <Link href="/admin/dashboard/products/new">
                                Yeni Ürün Ekle
                                <ArrowRight className="h-4 w-4 opacity-50" />
                            </Link>
                        </Button>
                        <Button variant="secondary" className="w-full justify-between" asChild>
                            <Link href="/admin/dashboard/brands?new=true">
                                Yeni Marka Ekle
                                <ArrowRight className="h-4 w-4 opacity-50" />
                            </Link>
                        </Button>
                        <Button variant="secondary" className="w-full justify-between" asChild>
                            <Link href="/admin/dashboard/models?new=true">
                                Yeni Model Ekle
                                <ArrowRight className="h-4 w-4 opacity-50" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
