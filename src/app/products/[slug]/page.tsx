import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ContactCorporateSection } from "@/components/shared/ContactCorporateSection";
import { ProductImageZoom } from "@/components/shared/ProductImageZoom";
import { Metadata } from "next";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const product = await prisma.product.findUnique({
        where: { slug: resolvedParams.slug },
        include: { brand: true, model: true },
    });

    if (!product) return { title: "Ürün Bulunamadı | Japoncu Sayman" };

    return {
        title: `${product.name} - ${product.oemCode} | Japoncu Sayman`,
        description: product.description || `${product.brand?.name} ${product.model?.name} için yedek parça.`,
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const resolvedParams = await params;
    const product = await prisma.product.findUnique({
        where: { slug: resolvedParams.slug, isDeleted: false },
        include: { brand: true, model: true, category: true },
    });

    if (!product) {
        notFound();
    }

    // Fetch site settings for WhatsApp number
    const settings = await prisma.settings.findUnique({
        where: { id: "site-settings" },
    });

    // Related products from the same model or brand
    const relatedProducts = await prisma.product.findMany({
        where: {
            id: { not: product.id },
            OR: [
                { modelId: product.modelId },
                { brandId: product.brandId }
            ]
        },
        take: 4,
        include: { brand: true, model: true },
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link href="/products" className="hover:text-primary transition-colors">Yedek Parça</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                {product.brand && (
                    <>
                        <Link href={`/products?brand=${product.brand.slug}`} className="hover:text-primary transition-colors">
                            {product.brand.name}
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                    </>
                )}
                <span className="text-foreground font-medium truncate">{product.name}</span>
            </nav>

            {/* Product Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                {/* Left: Product Image */}
                <div className="bg-muted rounded-2xl aspect-square flex items-center justify-center overflow-hidden border">
                    {product.imageUrl ? (
                        <ProductImageZoom imageUrl={product.imageUrl} altText={product.name} />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground p-12">
                            <span className="font-medium text-lg">Görsel Bulunmuyor</span>
                        </div>
                    )}
                </div>

                {/* Right: Product Info */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        {product.brand && (
                            <Badge className="bg-slate-800 hover:bg-slate-700 text-white border-transparent">
                                {product.brand.name}
                            </Badge>
                        )}
                        {product.category && (
                            <Badge variant="outline">{product.category.name}</Badge>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                        {product.name}
                    </h1>

                    <div className="flex items-center justify-between py-4 border-b">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">OEM Kodu</p>
                            <p className="font-mono text-lg font-medium">{product.oemCode}</p>
                        </div>
                        {product.manufacturer && (
                            <div className="flex-1 text-center">
                                <p className="text-sm text-muted-foreground">Üretici</p>
                                <p className="font-medium text-lg">{product.manufacturer}</p>
                            </div>
                        )}
                        <div className="flex-1 text-right">
                            <p className="text-sm text-muted-foreground">Uyumlu Model</p>
                            <p className="font-medium">{product.model?.name || "Universal"}</p>
                        </div>
                    </div>

                    <div className="my-8">
                        {product.price ? (
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-primary">{product.price.toLocaleString("tr-TR")}</span>
                                <span className="text-xl font-medium text-muted-foreground mb-1">₺</span>
                            </div>
                        ) : (
                            <span className="text-2xl font-semibold text-primary">Fiyat Sorunuz</span>
                        )}

                        <div className="flex items-center gap-3 mt-3">
                            <span className="text-sm text-muted-foreground">Stok Durumu:</span>
                            {product.isSpecialOrder ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                    ℹ Özel Sipariş (Stok bilgisi için iletişime geçin)
                                </span>
                            ) : product.stock > 10 ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    ✓ Stokta Var ({product.stock} adet)
                                </span>
                            ) : product.stock > 0 ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                    ⚠ Son {product.stock} Adet
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                    ✕ Tükendi
                                </span>
                            )}
                        </div>
                    </div>

                    {product.description && (
                        <div className="mb-8 prose prose-sm max-w-none text-muted-foreground">
                            <h3 className="text-foreground font-semibold mb-2">Ürün Açıklaması</h3>
                            <p>{product.description}</p>
                        </div>
                    )}

                    <div className="mt-auto pt-4 flex gap-3">
                        <WhatsAppButton
                            productName={product.name}
                            oemCode={product.oemCode}
                            phoneNumber={settings?.whatsapp || settings?.phone || undefined}
                            className="flex-1 py-6 text-lg rounded-xl"
                        />
                        <Link
                            href="/iletisim"
                            className="flex items-center justify-center gap-2 rounded-xl border border-input bg-background hover:bg-muted transition-colors px-5 font-medium text-sm"
                        >
                            İletişim
                        </Link>
                    </div>
                </div>
            </div>

            {/* Related Products Grid (Wait to import ProductCard dynamically or just let it compile) */}

            {/* İletişim ve Kurumsal Bölümler */}
            <ContactCorporateSection />
        </div>
    );
}
