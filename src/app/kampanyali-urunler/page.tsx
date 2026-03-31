import { Suspense } from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import { prisma } from "@/lib/prisma";
import { Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Kampanyalı Ürünler - Japoncu Sayman",
    description: "Japoncu Sayman özel fırsatları ve indirimli yedek parçaları",
};

export default async function CampaignProductsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const query = typeof searchParams.q === "string" ? searchParams.q : undefined;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-amber-50 p-6 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                        <Tag className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-amber-900">Kampanyalı Parçalar</h1>
                        <p className="text-amber-700 font-medium mt-1">
                            {query ? `"${query}" için kampanyalı ürünler` : "Şu anki aktif fırsatları ve indirimleri kaçırmayın."}
                        </p>
                    </div>
                </div>

                {/* Inline search for campaigns */}
                <form className="relative w-full md:w-auto" action="/kampanyali-urunler" method="GET">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Kampanyalarda ara..."
                        className="w-full md:w-[250px] h-10 rounded-md border border-amber-300 bg-white pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    />
                </form>
            </div>

            <div className="grid grid-cols-1">
                <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"><p>Yükleniyor...</p></div>}>
                    <CampaignProductList query={query} />
                </Suspense>
            </div>
        </div>
    );
}

async function CampaignProductList({ query }: { query?: string }) {
    // Only search where isCampaign is true
    const whereClause: any = {
        isCampaign: true
    };

    if (query) {
        whereClause.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { oemCode: { contains: query, mode: "insensitive" } },
        ];
    }

    const products = await prisma.product.findMany({
        where: whereClause,
        include: { brand: true, model: true },
        orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground">Şu an için kriterlerinize uygun kampanyalı ürün bulunmamaktadır.</p>
                <Button variant="outline" asChild className="mt-4 border-amber-200 text-amber-700 hover:bg-amber-50">
                    <a href="/products">Tüm ürünlere göz at</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <div key={product.id} className="relative">
                    <div className="absolute -top-3 -right-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-3">
                        KAMPANYA
                    </div>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}
