import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "İletişim | Japoncu Sayman",
    description: "Japoncu Sayman ile iletişime geçin. Adres, telefon ve WhatsApp bilgilerimiz.",
};

export default async function IletisimPage() {
    // In Prisma, the model Settings becomes settings in the client
    const settings = await (prisma as any).settings.findUnique({
        where: { id: "site-settings" },
    });

    const defaultSettings = {
        address: "Örnek Mahallesi, Oto Sanayi Sitesi No: 42, Bağcılar / İstanbul",
        phone: "+90 5XX XXX XX XX",
        phone2: "",
        email: "info@japoncusayman.com",
        workingHours: "Pazartesi – Cumartesi: 08:00 – 19:00\nPazar: Kapalı",
        whatsapp: "905XXXXXXXXX",
        instagram: "",
        googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.6!2d28.855!3d41.068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzA0LjgiTiAyOMKwNTEnMTguMCJF!5e0!3m2!1str!2str!4v1234567890",
    };

    const contactInfo = {
        address: settings?.address || defaultSettings.address,
        phone: settings?.phone || defaultSettings.phone,
        phone2: settings?.phone2 || defaultSettings.phone2,
        email: settings?.email || defaultSettings.email,
        workingHours: settings?.workingHours || defaultSettings.workingHours,
        whatsapp: settings?.whatsapp || defaultSettings.whatsapp,
        instagram: settings?.instagram || defaultSettings.instagram,
        googleMapsUrl: settings?.googleMapsUrl || defaultSettings.googleMapsUrl,
    };

    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/\+/g, "").replace(/\s+/g, "")}?text=Merhaba%2C%20Japoncu%20Sayman%27dan%20bilgi%20almak%20istiyorum.`;

    // Harita URL'sini temizle (Kullanıcı yanlışlıkla iframe kodunun tamamını yapıştırmış olabilir)
    let mapSrc = contactInfo.googleMapsUrl;
    if (mapSrc && mapSrc.includes("src=")) {
        const match = mapSrc.match(/src="([^"]+)"/);
        if (match) mapSrc = match[1];
    }
    // Eğer hala geçerli bir http linki değilse varsayılanı kullan
    if (!mapSrc || !mapSrc.startsWith("http")) {
        mapSrc = defaultSettings.googleMapsUrl;
    }

    // Yol tarifi için kullanılacak link (Adresi Google Maps'te aratır)
    const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`;

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Başlık */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-3">İletişim</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Sormak istediğiniz her şey için aşağıdaki kanallardan bize ulaşabilirsiniz.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Sol: İletişim Kartları */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="flex items-start gap-4 p-6">
                            <div className="shrink-0">
                                <MapPin className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-1">Adres</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {contactInfo.address}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-start gap-4 p-6">
                            <div className="shrink-0">
                                <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-1">Telefon</h3>
                                <div className="flex flex-col gap-1">
                                    <a
                                        href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                                    >
                                        {contactInfo.phone}
                                    </a>
                                    {contactInfo.phone2 && (
                                        <a
                                            href={`tel:${contactInfo.phone2.replace(/\s+/g, "")}`}
                                            className="text-muted-foreground text-sm hover:text-primary transition-colors"
                                        >
                                            {contactInfo.phone2}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {contactInfo.instagram && (
                        <Card>
                            <CardContent className="flex items-start gap-4 p-6">
                                <div className="shrink-0">
                                    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base mb-1">Instagram</h3>
                                    <a
                                        href={contactInfo.instagram.startsWith("http") ? contactInfo.instagram : `https://instagram.com/${contactInfo.instagram.replace("@", "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground text-sm hover:text-primary transition-colors block"
                                    >
                                        {contactInfo.instagram.startsWith("http") ? "Instagram Sayfamız" : contactInfo.instagram}
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardContent className="flex items-start gap-4 p-6">
                            <div className="shrink-0">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-1">E-posta</h3>
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                                >
                                    {contactInfo.email}
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-start gap-4 p-6">
                            <div className="shrink-0">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-1">Çalışma Saatleri</h3>
                                <p className="text-muted-foreground text-sm whitespace-pre-line">
                                    {contactInfo.workingHours}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* WhatsApp Butonu */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold py-4 transition-colors"
                    >
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp ile Yazın
                    </a>
                </div>

                {/* Sağ: Google Maps embed ve Yol Tarifi Butonu */}
                <div className="flex flex-col gap-4 lg:h-full">
                    <div className="rounded-2xl overflow-hidden border bg-muted h-[460px] flex-1 flex items-center justify-center min-h-[320px]">
                        <iframe
                            src={mapSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
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
                        Yol Tarifi Al / Haritada Aç
                    </a>
                </div>
            </div>
        </div>
    );
}
