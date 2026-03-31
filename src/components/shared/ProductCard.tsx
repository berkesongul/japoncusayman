import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { WhatsAppButton } from "./WhatsAppButton";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
    product: {
        name: string;
        slug: string;
        oemCode: string;
        description?: string | null;
        price?: number | null;
        imageUrl?: string | null;
        manufacturer?: string | null;
        brand?: { name: string } | null;
        model?: { name: string } | null;
    };
}

export function ProductCard({ product }: ProductCardProps) {
    // Use a placeholder if no image exists
    const imageUrl = product.imageUrl || "/placeholder-part.jpg";

    return (
        <Card className="group overflow-hidden flex flex-col transition-all hover:shadow-lg hover:border-primary/50 bg-card rounded-xl">
            <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-muted aspect-square">
                <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            Görsel Yok
                        </div>
                    )}
                </div>
            </Link>

            <CardHeader className="p-4 pb-2 space-y-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-[10px] bg-background">
                            {product.brand?.name || "Bilinmiyor"}
                        </Badge>
                        {product.manufacturer && (
                            <Badge variant="secondary" className="text-[10px] bg-blue-50/50">
                                {product.manufacturer}
                            </Badge>
                        )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded whitespace-nowrap">
                        {product.oemCode}
                    </span>
                </div>
                <Link href={`/products/${product.slug}`} className="block group-hover:text-primary transition-colors">
                    <h3 className="font-semibold text-base line-clamp-2 leading-tight">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-1">
                    {product.model?.name || "Universal"}
                </p>
            </CardHeader>

            <CardContent className="p-4 pt-1 flex-1 flex items-end">
                <div className="w-full mt-2">
                    {product.price ? (
                        <p className="font-bold text-lg">{product.price.toLocaleString("tr-TR")} ₺</p>
                    ) : (
                        <p className="text-sm font-medium text-muted-foreground">Fiyat Sorunuz</p>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <WhatsAppButton
                    productName={product.name}
                    oemCode={product.oemCode}
                    fullWidth
                />
            </CardFooter>
        </Card>
    );
}
