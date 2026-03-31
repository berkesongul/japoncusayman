import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, MapPin, Phone, Mail, Clock, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { ScaleIn } from "@/components/animations/ScaleIn";

export default async function Home() {
  // Fetch latest products and brands concurrently
  const [latestProducts, featuredBrands, settings] = await Promise.all([
    prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { brand: true, model: true },
    }),
    prisma.brand.findMany({
      take: 6,
      orderBy: { name: "asc" },
    }),
    (prisma as any).settings.findUnique({
      where: { id: "site-settings" },
    }),
  ]);

  const defaultSettings = {
    address: "Örnek Mahallesi, Oto Sanayi Sitesi No: 42, Bağcılar / İstanbul",
    phone: "+90 5XX XXX XX XX",
    email: "info@japoncusayman.com",
    workingHours: "Pzt – Cmt: 08:00 – 19:00\nPazar: Kapalı",
    whatsapp: "905XXXXXXXXX",
    googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.6!2d28.855!3d41.068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzA0LjgiTiAyOMKwNTEnMTguMCJF!5e0!3m2!1str!2str!4v1234567890",
  };

  const contactInfo = {
    address: settings?.address || defaultSettings.address,
    phone: settings?.phone || defaultSettings.phone,
    email: settings?.email || defaultSettings.email,
    workingHours: settings?.workingHours || defaultSettings.workingHours,
    whatsapp: settings?.whatsapp || defaultSettings.whatsapp,
    googleMapsUrl: settings?.googleMapsUrl || defaultSettings.googleMapsUrl,
  };

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32 lg:pt-32 lg:pb-48 text-white">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/main-page/banner/slide1.png"
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
          {/* 0.3 opacity dark overlay */}
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>

        {/* Decorative glow */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl shadow-2xl opacity-40 z-0" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <FadeIn delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">
                  Japoncu Sayman <br />
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                  Japoncu Sayman, Japon araçları öncelikli olmak üzere tüm araç marka ve modelleri için orijinal ve yüksek kaliteli parçaları en uygun fiyatlarla sunar ve çözüm üretir.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="text-lg font-medium px-8" asChild>
                    <Link href="/products">Parça Ara</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg font-medium bg-transparent text-white border-white/30 hover:bg-white/10 px-8" asChild>
                    <Link href="/#brands">Markalar</Link>
                  </Button>
                </div>
              </FadeIn>

              <StaggerContainer delayChildren={0.4} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-8 border-t border-white/10">
                <StaggerItem>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <ShieldCheck className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Güvenilir Ürün</h4>
                      <p className="text-sm text-slate-400">Garantili araç parçaları</p>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Truck className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Hızlı Gönderim</h4>
                      <p className="text-sm text-slate-400">Aynı gün kargo imkanı</p>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Geniş Stok</h4>
                      <p className="text-sm text-slate-400">Tüm araç markaları</p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Right Side: Search Box */}
            <div className="lg:w-1/2 w-full">
              <FadeIn delay={0.3} direction="down">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Ürün Ara</h3>
                      <p className="text-slate-300 text-sm">Parça adı, marka veya OEM kodu ile hızlıca bulun.</p>
                    </div>

                    <form action="/products" method="GET" className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="q"
                          placeholder="Örn: Toyota Corolla Balata"
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-12 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      </div>
                      <Button type="submit" size="lg" className="w-full text-lg h-14">
                        Hemen Bul
                      </Button>
                    </form>

                    <div className="pt-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Popüler Aramalar</p>
                      <div className="flex flex-wrap gap-2">
                        {['Fren Balatası', 'Yağ Filtresi', 'Amortisör', 'Hava Filtresi'].map((tag) => (
                          <Link
                            key={tag}
                            href={`/products?q=${tag}`}
                            className="text-xs bg-white/5 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section id="brands" className="container mx-auto px-4 max-w-7xl">
        <FadeIn className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Öne Çıkan Markalar</h2>
            <p className="text-muted-foreground">Aradığınız modele uygun parçaları marka seçerek bulun.</p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          {featuredBrands.map((brand) => (
            <StaggerItem key={brand.id} direction="up">
              <Link
                href={`/products?brand=${brand.slug}`}
                className="group flex flex-col items-center justify-center p-6 bg-card border rounded-2xl transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1 h-full"
              >
                <div className="w-full h-24 relative flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  {brand.imageUrl ? (
                    <Image
                      src={brand.imageUrl}
                      alt={brand.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 50vw, 15vw"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      {brand.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-center">{brand.name}</h3>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Latest Products */}
      <section className="container mx-auto px-4 max-w-7xl">
        <FadeIn className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Yeni Eklenen Parçalar</h2>
            <p className="text-muted-foreground">En yeni stoklarımızdan seçmeler.</p>
          </div>
          <Button variant="ghost" className="gap-2 hidden md:flex" asChild>
            <Link href="/products">
              Tümünü Gör
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn direction="up" delay={0.2} className="flex justify-center mt-10 md:hidden">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/products">
              Tüm Ürünleri Gör
            </Link>
          </Button>
        </FadeIn>
      </section>

      {/* Kurumsal Section */}
      <section className="bg-slate-50 py-20 border-y border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right" className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Japoncu Sayman Kimdir?</h2>
              <p className="text-slate-600 leading-relaxed">
                1980'li yıllarda temelleri atılan <strong>Japoncu Sayman</strong>, otomotiv yedek parça sektöründe dürüstlük ve kalite prensipleriyle yoluna devam etmektedir. Özellikle Japon ve Kore menşeli araçların yedek parça tedariğinde uzmanlaşmış kadromuzla, Türkiye'nin her noktasına hizmet sunmaktayız.
              </p>
              <Button asChild variant="outline">
                <Link href="/kurumsal">Daha Fazla Bilgi</Link>
              </Button>
            </FadeIn>
            <FadeIn direction="left" delay={0.2} className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/main-page/banner/slide1.png"
                alt="Kurumsal"
                fill
                className="object-cover"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="iletisim" className="container mx-auto px-4 max-w-5xl overflow-hidden">
        <FadeIn direction="up" className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">İletişim</h2>
          <p className="text-muted-foreground">Sormak istediğiniz her şey için bize ulaşın.</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Contact Cards */}
          <StaggerContainer className="space-y-4">
            <StaggerItem>
              <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card">
                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adres</h3>
                  <p className="text-muted-foreground text-sm">{contactInfo.address}</p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card">
                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Telefon</h3>
                  <a href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`} className="text-muted-foreground text-sm hover:text-primary transition-colors">{contactInfo.phone}</a>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card">
                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">E-posta</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground text-sm hover:text-primary transition-colors">{contactInfo.email}</a>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4 p-5 rounded-2xl border bg-card">
                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">{contactInfo.workingHours}</p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/\+/g, "").replace(/\s+/g, "")}?text=Merhaba%2C%20bilgi%20almak%20istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold py-4 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp ile Yazın
              </a>
            </StaggerItem>
          </StaggerContainer>

          {/* Right: Map */}
          <ScaleIn delay={0.2} className="rounded-2xl overflow-hidden border bg-muted min-h-[320px] h-full">
            <iframe
              src={contactInfo.googleMapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Japoncu Sayman Konum"
            />
          </ScaleIn>
        </div>
      </section>
    </div>
  );
}
