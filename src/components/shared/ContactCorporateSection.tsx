import Link from "next/link";
import {
    ArrowRight,
    ShieldCheck,
    Truck,
    Clock,
    MapPin,
    Phone,
    Mail,
    MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

export async function ContactCorporateSection() {
    const settings = await (prisma as any).settings.findUnique({
        where: { id: "site-settings" },
    });

    const defaultSettings = {
        address: "Örnek Mahallesi, Oto Sanayi Sitesi No: 42, Bağcılar / İstanbul",
        phone: "+90 5XX XXX XX XX",
        email: "info@japoncusayman.com",
        workingHours: "Pzt – Cmt: 08:00 – 19:00\nPazar: Kapalı",
        whatsapp: "905XXXXXXXXX",
        googleMapsUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.6!2d28.855!3d41.068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzA0LjgiTiAyOMKwNTEnMTguMCJF!5e0!3m2!1str!2str!4v1234567890",
    };

    const contactInfo = {
        address: settings?.address || defaultSettings.address,
        phone: settings?.phone || defaultSettings.phone,
        email: settings?.email || defaultSettings.email,
        workingHours: settings?.workingHours || defaultSettings.workingHours,
        whatsapp: settings?.whatsapp || defaultSettings.whatsapp,
        googleMapsUrl: settings?.googleMapsUrl || defaultSettings.googleMapsUrl,
    };

    // Harita URL'sini temizle
    let mapSrc = contactInfo.googleMapsUrl;
    if (mapSrc && mapSrc.includes("src=")) {
        const match = mapSrc.match(/src="([^"]+)"/);
        if (match) mapSrc = match[1];
    }
    if (!mapSrc || !mapSrc.startsWith("http")) {
        mapSrc = defaultSettings.googleMapsUrl;
    }

    const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`;

    return (
        <div className="mt-20 space-y-20">
            {/* ─── Kurumsal Özet ─── */}
            <section className="relative bg-slate-900 text-white rounded-3xl overflow-hidden">
                {/* Dot pattern background */}
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="relative z-10 px-6 py-14 sm:px-10 md:px-16 lg:py-20">
                    <FadeIn direction="up">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Sol: Metin */}
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                    Japoncu Sayman Kimdir?
                                </h2>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    2025 yılında temelleri atılan{" "}
                                    <strong className="text-white font-semibold">
                                        Japoncu Sayman
                                    </strong>
                                    , Japon ve Kore menşeli araçların yedek parça tedariğinde
                                    uzmanlaşmış, modern vizyonlu bir yedek parça merkezi olarak
                                    hizmet vermektedir. Doğru parçaya hızlı erişim, şeffaf fiyat
                                    politikası ve Türkiye genelinde güçlü lojistik ağı ile sektörde
                                    fark yaratmaktadır.
                                </p>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="bg-transparent text-white border-white/30 hover:bg-white/10"
                                >
                                    <Link href="/kurumsal">
                                        Detaylı Bilgi
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Sağ: 3 Özellik Kartı */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    {
                                        icon: ShieldCheck,
                                        title: "Güvenilir Ürün",
                                        desc: "Orijinal ve kalite onaylı parçalar",
                                        color: "text-blue-400",
                                        bg: "bg-blue-500/10",
                                    },
                                    {
                                        icon: Truck,
                                        title: "Hızlı Gönderim",
                                        desc: "81 ile aynı gün kargo",
                                        color: "text-emerald-400",
                                        bg: "bg-emerald-500/10",
                                    },
                                    {
                                        icon: Clock,
                                        title: "Zaman Tasarrufu",
                                        desc: "OEM koduyla anında bulun",
                                        color: "text-amber-400",
                                        bg: "bg-amber-500/10",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                                    >
                                        <div
                                            className={`${item.bg} p-3 rounded-xl mb-4`}
                                        >
                                            <item.icon className={`h-6 w-6 ${item.color}`} />
                                        </div>
                                        <h3 className="font-semibold mb-1">{item.title}</h3>
                                        <p className="text-sm text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ─── İletişim Özet ─── */}
            <section>
                <FadeIn direction="up" className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">
                        Bize Ulaşın
                    </h2>
                    <p className="text-muted-foreground">
                        Sormak istediğiniz her şey için aşağıdaki kanallardan bize
                        ulaşabilirsiniz.
                    </p>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Sol: İletişim Kartları */}
                    <StaggerContainer className="space-y-4">
                        <StaggerItem>
                            <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Adres</h3>
                                    <p className="text-muted-foreground text-sm">
                                        {contactInfo.address}
                                    </p>
                                </div>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Telefon</h3>
                                    <a
                                        href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                                    >
                                        {contactInfo.phone}
                                    </a>
                                </div>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">E-posta</h3>
                                    <a
                                        href={`mailto:${contactInfo.email}`}
                                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                                    >
                                        {contactInfo.email}
                                    </a>
                                </div>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                                    <Clock className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
                                    <p className="text-muted-foreground text-sm whitespace-pre-line">
                                        {contactInfo.workingHours}
                                    </p>
                                </div>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="flex gap-3">
                                <a
                                    href={`https://wa.me/${contactInfo.whatsapp.replace(/\+/g, "").replace(/\s+/g, "")}?text=Merhaba%2C%20bilgi%20almak%20istiyorum.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold py-4 transition-colors"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    WhatsApp ile Yazın
                                </a>
                                <Link
                                    href="/iletisim"
                                    className="flex items-center justify-center gap-2 rounded-xl border border-input bg-background hover:bg-muted transition-colors px-6 font-medium text-sm"
                                >
                                    İletişim Sayfası
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </StaggerItem>
                    </StaggerContainer>

                    {/* Sağ: Harita */}
                    <FadeIn direction="none" delay={0.2} className="flex flex-col gap-4">
                        <div className="rounded-2xl overflow-hidden border bg-muted min-h-[320px] flex-1">
                            <iframe
                                src={mapSrc}
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: 320 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Japoncu Sayman Konum"
                            />
                        </div>
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-shrink-0 h-14 transition-colors"
                        >
                            <MapPin className="h-5 w-5" />
                            Yol Tarifi Al
                        </a>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
}
