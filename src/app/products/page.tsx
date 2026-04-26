import { Suspense } from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import { ContactCorporateSection } from "@/components/shared/ContactCorporateSection";
import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Yedek Parça Arama - Japoncu Sayman",
    description: "Aracınız için en uygun yedek parçayı bulun.",
};

// Next.js 15+ searchParams are asynchronous
export default async function ProductsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
    const brandSlug = typeof searchParams.brand === "string" ? searchParams.brand : undefined;
    const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined;

    // Fetch brands and categories from database for the sidebar
    const [brands, categories] = await Promise.all([
        prisma.brand.findMany({ orderBy: { name: "asc" } }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    // Rate limit check using headers
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
    
    // Yalnızca arama için limit (sayfaya girilen)
    const { rateLimit } = await import("@/lib/rate-limit");
    if (!rateLimit(ip, "products", 20, 60000).success) {
        const { redirect } = await import("next/navigation");
        redirect("/too-many-requests");
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tüm Parçalar</h1>
                    <p className="text-muted-foreground mt-1">
                        {query ? `"${query}" için arama sonuçları` : brandSlug ? `Seçili marka: ${brandSlug}` : categorySlug ? `Seçili kategori: ${categorySlug}` : "Katalogdaki tüm ürünleri inceleyin."}
                    </p>
                </div>

                {/* Simple inline search for the products page */}
                <form className="relative w-full md:w-auto" action="/products" method="GET">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Parça, marka veya OEM Kod..."
                        className="w-full md:w-[300px] h-10 rounded-md border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    {/* Preserve brand filter if exists */}
                    {brandSlug && <input type="hidden" name="brand" value={brandSlug} />}
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar filters - DYNAMIC from database */}
                <div className="hidden lg:block space-y-6">
                    <div>
                        <h3 className="font-semibold mb-4 border-b pb-2">Kategoriler</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="/products" className={`hover:text-primary transition-colors ${!categorySlug && !brandSlug && !query ? 'text-primary font-medium' : ''}`}>
                                    Tüm Ürünler
                                </a>
                            </li>
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <a
                                        href={`/products?category=${category.slug}`}
                                        className={`hover:text-primary transition-colors ${categorySlug === category.slug ? 'text-primary font-medium' : ''}`}
                                    >
                                        {category.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 border-b pb-2">Markalar</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {brands.map((brand) => (
                                <li key={brand.id}>
                                    <a
                                        href={`/products?brand=${brand.slug}`}
                                        className={`hover:text-primary transition-colors ${brandSlug === brand.slug ? 'text-primary font-medium' : ''}`}
                                    >
                                        {brand.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"><p>Yükleniyor...</p></div>}>
                        <ProductList query={query} brandSlug={brandSlug} categorySlug={categorySlug} />
                    </Suspense>
                </div>
            </div>

            {/* İletişim ve Kurumsal Bölümler */}
            <ContactCorporateSection />
        </div>
    );
}

async function ProductList({ query, brandSlug, categorySlug }: { query?: string; brandSlug?: string; categorySlug?: string }) {
    // Construct the Prisma where clause based on the filters
    const whereClause: any = {
        isDeleted: false
    };

    // Fetch site settings for WhatsApp number
    const settings = await prisma.settings.findUnique({
        where: { id: "site-settings" },
    });
    const whatsappNumber = settings?.whatsapp || settings?.phone || undefined;

    if (query) {
        whereClause.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { oemCode: { contains: query, mode: "insensitive" } },
        ];
    }

    if (brandSlug) {
        whereClause.brand = { slug: brandSlug };
    }

    if (categorySlug) {
        whereClause.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
        where: whereClause,
        include: { brand: true, model: true },
        orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground">Arama kriterlerinize uygun ürün bulunamadı.</p>
                <Button variant="link" asChild className="mt-2">
                    <a href="/products">Tüm ürünleri görüntüle</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
            ))}
        </div>
    );
}
