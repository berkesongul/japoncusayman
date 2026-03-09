import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-6 md:py-12 mt-12">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by <span className="font-semibold text-foreground">Japoncu Sayman</span>.
                        {" "}The standard for high-quality automotive spare parts.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Link
                        href="/iletisim"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        İletişim
                    </Link>
                    <Link
                        href="/hakkimizda"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Hakkımızda
                    </Link>
                </div>
            </div>
        </footer>
    );
}
