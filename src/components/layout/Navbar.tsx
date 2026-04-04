"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, UserCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsOpen(false);
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push(`/products`);
        }
    };

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6 md:gap-10">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/japoncu-sayman-logo.svg"
                            alt="Japoncu Sayman"
                            width={220}
                            height={56}
                            priority
                            className="h-14 w-auto"
                        />
                    </Link>
                    <nav className="hidden lg:flex gap-6 lg:gap-10">
                        <Link
                            href="/"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Ana Sayfa
                        </Link>
                        <Link
                            href="/kurumsal"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Kurumsal
                        </Link>
                        <Link
                            href="/products"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Yedek Parça
                        </Link>
                        <Link
                            href="/markalar"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Markalar
                        </Link>
                        <Link
                            href="/kampanyali-urunler"
                            className="flex items-center text-sm font-medium text-amber-500 transition-colors hover:text-amber-600"
                        >
                            Kampanyalar
                        </Link>
                        <Link
                            href="/iletisim"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            İletişim
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center space-x-2">
                    <form onSubmit={handleSearch} className="hidden lg:flex w-full max-w-sm items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Parça, marka veya OEM Kod ara..."
                                className="flex h-9 w-full md:w-[300px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                            />
                        </div>
                        <Button type="submit" size="sm">Ara</Button>
                    </form>

                    <Link
                        href="/admin/login"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-input bg-background hover:bg-muted transition-colors"
                        title="Yönetici Girişi"
                    >
                        <UserCircle className="h-5 w-5 text-muted-foreground" />
                    </Link>

                    {/* Mobile Navigation Sheet */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger className="inline-flex lg:hidden items-center justify-center w-10 h-10 rounded-md border border-input bg-background hover:bg-muted transition-colors">
                            <Menu className="h-6 w-6 text-muted-foreground" />
                            <span className="sr-only">Menüyü Aç</span>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] sm:w-[400px] flex flex-col p-0">
                            <SheetHeader className="p-4 sm:p-6 border-b">
                                <SheetTitle className="text-left mt-2">
                                    <Image
                                        src="/images/japoncu-sayman-logo.svg"
                                        alt="Japoncu Sayman"
                                        width={180}
                                        height={46}
                                        priority
                                        className="h-10 w-auto"
                                    />
                                </SheetTitle>
                            </SheetHeader>
                            
                            <div className="p-4 sm:p-6 pb-2 border-b">
                                {/* Mobile Search */}
                                <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
                                    <div className="relative w-full">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Parça, marka ara..."
                                            className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground"
                                        />
                                    </div>
                                    <Button type="submit" size="sm" className="h-10 px-4 whitespace-nowrap">Ara</Button>
                                </form>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-3.5 text-base font-semibold text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors border border-transparent hover:border-border"
                                >
                                    Ana Sayfa
                                </Link>
                                <Link
                                    href="/kurumsal"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-3.5 text-base font-semibold text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors border border-transparent hover:border-border"
                                >
                                    Kurumsal
                                </Link>
                                <Link
                                    href="/products"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-3.5 text-base font-semibold text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors border border-transparent hover:border-border"
                                >
                                    Yedek Parça
                                </Link>
                                <Link
                                    href="/markalar"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-3.5 text-base font-semibold text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors border border-transparent hover:border-border"
                                >
                                    Markalar
                                </Link>
                                <Link
                                    href="/kampanyali-urunler"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-3.5 text-base font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                                >
                                    Kampanyalı Ürünler
                                </Link>
                                <Link
                                    href="/iletisim"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-3.5 text-base font-semibold text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors border border-transparent hover:border-border"
                                >
                                    İletişim
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
}
