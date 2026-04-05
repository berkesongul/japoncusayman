import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-6 mt-12">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0 text-sm text-muted-foreground">
                {/* Sol: Copyright */}
                <p className="text-center md:text-left pl-32">
                    © {new Date().getFullYear()} Japoncu Sayman. Tüm hakları saklıdır.
                </p>

                {/* Orta: Nav */}
                <nav className="flex items-center gap-6 flex-wrap justify-center">
                    <Link href="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
                    <Link href="/kurumsal" className="hover:text-foreground transition-colors">Kurumsal</Link>
                    <Link href="/products" className="hover:text-foreground transition-colors">Yedek Parça</Link>
                    <Link href="/#brands" className="hover:text-foreground transition-colors">Markalar</Link>
                    <Link href="/iletisim" className="hover:text-foreground transition-colors">İletişim</Link>
                    <Link href="/kvkk" className="hover:text-foreground transition-colors">KVKK</Link>
                    <Link href="/sss" className="hover:text-foreground transition-colors">S.S.S.</Link>
                </nav>

                {/* Sağ: Developer */}
                <p className="text-center md:text-right">
                    Developed by{" "}
                    <a
                        href="https://instagram.com/berkesongul97"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:underline"
                    >
                        berkesongul
                    </a>
                </p>
            </div>
        </footer>
    );
}
