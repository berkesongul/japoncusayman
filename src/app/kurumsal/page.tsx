import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function KurumsalPage() {
    return (
        <div className="flex flex-col gap-16 pb-16">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center text-white overflow-hidden">
                <Image
                    src="/images/main-page/banner/slide1.png"
                    alt="Kurumsal"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-slate-900/70" />
                <div className="container relative z-10 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Kurumsal</h1>
                    <p className="text-lg text-slate-200 max-w-2xl mx-auto italic">
                        "40 yılı aşkın tecrübemizle, Japon ve Uzakdoğu araçlarınız için güvenilir çözüm ortağınız."
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <div className="inline-block p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                            <Users className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Japoncu Sayman Kimdir?</h2>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>
                                1980'li yıllarda temelleri atılan <strong>Japoncu Sayman</strong>, otomotiv yedek parça sektöründe dürüstlük ve kalite prensipleriyle yoluna devam etmektedir. Özellikle Japon ve Kore menşeli araçların yedek parça tedariğinde uzmanlaşmış kadromuzla, Türkiye'nin her noktasına hizmet sunmaktayız.
                            </p>
                            <p>
                                Müşteri memnuniyetini her zaman en ön planda tutarak, hem orijinal hem de yüksek kaliteli yan sanayi (aftermarket) parçaları en uygun maliyetlerle kullanıcıya ulaştırıyoruz. Geniş stok ağımız ve hızlı lojistik çözümlerimizle aracınızın yolda kalmaması için çalışıyoruz.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Orijinal Kalite</h4>
                                    <p className="text-sm text-slate-500">Garantili ve test edilmiş ürünler.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-blue-500 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Güvenli Alışveriş</h4>
                                    <p className="text-sm text-slate-500">Sektörde 40 yıllık güven.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-square lg:aspect-video rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src="/images/main-page/banner/slide1.png"
                            alt="Japoncu Sayman Ofis"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Core Values / Stats */}
            <section className="bg-slate-50 py-20 border-y border-slate-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-primary">40+</div>
                            <p className="text-slate-600 font-medium">Yıllık Tecrübe</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-primary">50.000+</div>
                            <p className="text-slate-600 font-medium">Parça Çeşidi</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-primary">%100</div>
                            <p className="text-slate-600 font-medium">Müşteri Memnuniyeti</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900">Vizyonumuz</h3>
                        <p className="text-slate-600">
                            Yedek parça sektöründe teknolojik gelişmeleri yakından takip ederek, Türkiye'nin en güvenilir ve en kolay ulaşılabilir Japon yedek parça merkezi olmak.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900">Misyonumuz</h3>
                        <p className="text-slate-600">
                            Araç sahiplerine ve servislere, ihtiyaç duydukları doğru parçayı, en hızlı şekilde ve şeffaf fiyat politikasıyla sunarak otomotiv ekosistemine değer katmak.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
