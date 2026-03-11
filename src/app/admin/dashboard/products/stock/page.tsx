import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Stok Yönetimi | Japoncu Sayman",
};

async function updateStock(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const stock = parseInt(formData.get("stock") as string, 10);
    if (!id || isNaN(stock) || stock < 0) return;
    await prisma.product.update({ where: { id }, data: { stock } });
    revalidatePath("/admin/dashboard/products/stock");
}

export default async function StockPage() {
    const products = await prisma.product.findMany({
        include: { brand: true },
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Stok Yönetimi</h1>
                <p className="text-muted-foreground mt-1">Ürünlere ait stok miktarlarını güncelleyin.</p>
            </div>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-lg">Ürün Stokları ({products.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {products.map((product) => (
                            <form key={product.id} action={updateStock} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-4">
                                <input type="hidden" name="id" value={product.id} />

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{product.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Badge variant="outline" className="text-xs">{product.brand?.name}</Badge>
                                        <span className="text-xs text-muted-foreground font-mono">{product.oemCode}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">Mevcut:</span>
                                        <span className={`text-sm font-bold ${product.stock > 10 ? "text-green-600" :
                                                product.stock > 0 ? "text-orange-500" : "text-red-600"
                                            }`}>
                                            {product.stock} adet
                                        </span>
                                    </div>

                                    <input
                                        type="number"
                                        name="stock"
                                        defaultValue={product.stock}
                                        min={0}
                                        className="w-20 px-2 py-1.5 text-sm border border-input rounded-md bg-background text-center focus:outline-none focus:ring-1 focus:ring-ring"
                                    />

                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap"
                                    >
                                        Güncelle
                                    </button>
                                </div>
                            </form>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
