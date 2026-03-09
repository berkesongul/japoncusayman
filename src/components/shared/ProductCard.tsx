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
        description?: string;
        price?: number;
        imageUrl?: string;
        brand?: { name: string };
        model?: { name: string };
    };
}

export function ProductCard({ product }: ProductCardProps) {
    // Use a placeholder if no image exists
    const imageUrl = product.imageUrl || "/placeholder-part.jpg";

    return (
        <Card className="group overflow-hidden flex flex-col transition-all hover:shadow-lg hover:border-primary/50 bg-card rounded-xl">
            <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-muted aspect-square">
                {/* We will need to set up domains in next config if fetching from s3, test with local placeholder */}
                <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105">
                    {/* Ensure Nextjs Image has an alt text and layout fill for responsive square ratio */}
                    <div className="relative w-full h-full bg-slate-200 animate-pulse rounded-md flex items-center justify-center overflow-hidden">
                        {/* Replace with actual next/image later when we have real domains or local files */}
                        <span className="text-muted-foreground font-medium text-sm">Resim Yok</span>
                    </div>
                </div>
            </Link>

            <CardHeader className="p-4 pb-2 space-y-1">
                <div className="flex justify-between items-start gap-2">
                    <Badge variant="outline" className="text-xs bg-background">
                        {product.brand?.name || "Bilinmiyor"}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
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
