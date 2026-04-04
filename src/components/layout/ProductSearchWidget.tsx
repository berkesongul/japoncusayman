"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductSearchWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    if (pathname?.startsWith("/admin")) return null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsOpen(false);
            setSearchQuery("");
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 left-10 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-all hover:scale-110 hover:bg-blue-700 active:scale-95"
                aria-label="Ürün Ara"
            >
                <Search className="h-8 w-8" />
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-lg bg-card border rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Search className="h-5 w-5 text-blue-500" />
                                Hızlı Ürün Bulma
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-muted transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-muted-foreground text-sm mb-6">
                            Parça adı, marka veya OEM kodu girerek hızlıca arama yapın.
                        </p>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    autoFocus
                                    placeholder="Örn: Toyota Balata, 42431-0D040"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-12 text-base"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-lg font-semibold">
                                Ara
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Popüler Aramalar</p>
                            <div className="flex flex-wrap gap-2">
                                {['Fren Balatası', 'Yağ Filtresi', 'Amortisör', 'Hava Filtresi'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            router.push(`/products?q=${encodeURIComponent(tag)}`);
                                            setIsOpen(false);
                                        }}
                                        className="text-xs bg-muted hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-full transition-all border border-transparent hover:border-blue-200"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
