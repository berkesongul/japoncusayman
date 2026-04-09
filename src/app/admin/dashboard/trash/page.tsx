import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, RotateCcw } from "lucide-react";
import { TrashActions } from "@/components/admin/TrashActions";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const metadata = {
    title: "Çöp Kutusu | Japoncu Sayman Yönetim",
    description: "Silinen ürünler ve kurtarma merkezi",
};

export default async function TrashPage() {
    const deletedProducts = await prisma.product.findMany({
        where: { isDeleted: true },
        include: {
            brand: true,
            model: true,
        },
        orderBy: { deletedAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                        <Trash2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Çöp Kutusu</h1>
                        <p className="text-muted-foreground mt-1">Silinen ürünleri buradan geri getirebilir veya tamamen silebilirsiniz.</p>
                    </div>
                </div>
            </div>

            <Card className="border-red-100">
                <CardHeader className="bg-red-50/50 py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        Silinen Ürünler ({deletedProducts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Ürün</TableHead>
                                    <TableHead>OEM Kodu</TableHead>
                                    <TableHead>Marka / Model</TableHead>
                                    <TableHead>Silinme Tarihi</TableHead>
                                    <TableHead className="w-[200px] text-center">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deletedProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <RotateCcw className="h-8 w-8 opacity-20" />
                                                <p>Çöp kutusu şu an boş.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    deletedProducts.map((product) => (
                                        <TableRow key={product.id} className="hover:bg-red-50/30 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="truncate block" title={product.name}>{product.name}</span>
                                                    <span className="text-[10px] text-muted-foreground truncate opacity-70">
                                                        ID: {product.id}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">{product.oemCode}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="bg-blue-50/50">{product.brand?.name}</Badge>
                                                    {product.model && (
                                                        <Badge variant="outline" className="bg-slate-50/50">{product.model.name}</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {product.deletedAt ? format(new Date(product.deletedAt), "d MMMM yyyy HH:mm", { locale: tr }) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <TrashActions productId={product.id} productName={product.name} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            {deletedProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <div className="p-1 bg-amber-100 text-amber-600 rounded">
                        <Trash2 className="h-4 w-4" />
                    </div>
                    <div className="text-sm text-amber-800">
                        <p className="font-semibold">Bilgi:</p>
                        <p>Buradan silinen ürünler veritabanından ve sunucudaki görsel dosyalarından <strong>kalıcı olarak</strong> silinir. Bu işlem geri alınamaz.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
