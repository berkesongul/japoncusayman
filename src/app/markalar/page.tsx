import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

export const metadata = {
    title: "Markalar - Japoncu Sayman",
    description: "Japoncu Sayman'da bulunan tüm araç markalarını keşfedin. Ford, Honda, Mazda, Mitsubishi, Nissan, Opel, Toyota ve daha fazlası.",
};

export default async function BrandsPage() {
    const brands = await prisma.brand.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <FadeIn className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-3">Tüm Markalar</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Aradığınız araca uygun yedek parçaları marka seçerek kolayca bulabilirsiniz.
                </p>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {brands.map((brand) => (
                    <StaggerItem key={brand.id} direction="up">
                        <Link
                            href={`/products?brand=${brand.slug}`}
                            className="group flex flex-col items-center justify-center p-6 bg-card border rounded-2xl transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1 h-full"
                        >
                            <div className="w-full h-28 relative flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                {brand.imageUrl ? (
                                    <Image
                                        src={brand.imageUrl}
                                        alt={brand.name}
                                        fill
                                        unoptimized
                                        className="object-contain p-2"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                                        {brand.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <h3 className="font-semibold text-center text-lg">{brand.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {brand._count.products} ürün
                            </p>
                        </Link>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {brands.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Henüz marka eklenmemiş.</p>
                </div>
            )}
        </div>
    );
}
