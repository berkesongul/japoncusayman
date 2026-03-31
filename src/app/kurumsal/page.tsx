"use client";

import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Users, Cpu, Shield, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

export default function KurumsalPage() {
    const fadeIn: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="flex flex-col gap-16 pb-16 overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-[450px] flex items-center justify-center text-white overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/images/main-page/banner/slide1.png"
                        alt="Kurumsal"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
                <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]" />
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="container relative z-10 text-center space-y-6 px-4"
                >
                    <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        Kurumsal
                    </motion.h1>
                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto italic font-medium">
                        "Japon ve Uzakdoğu araçlarınız için dinamik, teknolojik ve güvenilir çözüm ortağınız."
                    </motion.p>
                </motion.div>
            </section>

            {/* Who Are We Content Section */}
            <section className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="space-y-6"
                    >
                        <motion.div variants={fadeIn} className="inline-block p-3 rounded-2xl bg-blue-500/10 text-blue-600 mb-2">
                            <Users className="h-6 w-6" />
                        </motion.div>
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                            Japoncu Sayman Kimdir?
                        </motion.h2>
                        <motion.div variants={fadeIn} className="space-y-5 text-slate-600 leading-relaxed text-lg">
                            <p>
                                2025 yılında temelleri atılan <strong className="text-slate-900 font-semibold">Japoncu Sayman</strong>, otomotiv yedek parça sektöründeki geleneksel ve hantal yapıların aksine, günümüzün hızına ve dijital gereksinimlerine uyum sağlayan modern bir vizyonla kurulmuştur. Sektördeki "eski usul" yaklaşımların ötesine geçerek, özellikle Japon ve Kore menşeli araç gruplarında derinlemesine uzmanlaşmış bir tedarik süreci yürütmekteyiz.
                            </p>
                            <p>
                                Piyasadaki genel geçer vaatlerin ötesinde, realiteye dayalı bir hizmet anlayışını benimsiyoruz: Araç sahiplerinin ve servislerin en büyük sorunu olan "doğru parçaya hızlı erişim" problemini, dinamik stok yönetimimiz ve güncel lojistik ağımızla çözüyoruz. Hem orijinal ekipman hem de fiyat/performans dengesi gözetilerek seçilmiş, standartları karşılayan yan sanayi (aftermarket) seçeneklerini, şeffaf fiyat politikasıyla sunuyoruz.
                            </p>
                            <p>
                                Türkiye'nin her noktasına ulaşan sevkiyat ağımızla, aracınızın serviste geçirdiği süreyi minimuma indirmeyi hedefliyoruz. Japoncu Sayman olarak amacımız, sadece parça satmak değil; teknik bilgi birikimimizle yanlış parça siparişlerinin önüne geçmek ve araç sahiplerine bütçe dostu, sürdürülebilir çözümler üretmektir. Yeni nesil bir yedek parça deneyimi için gelişen teknolojiyle birlikte stoklarımızı ve hizmet kalitemizi her geçen gün optimize etmeye devam ediyoruz.
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group"
                    >
                        <Image
                            src="/images/main-page/banner/slide1.png"
                            alt="Modern Ofis ve Depo"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                </div>
            </section>

            {/* Core Values / Stats */}
            <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center"
                    >
                        <motion.div variants={fadeIn} className="space-y-3">
                            <div className="mx-auto w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <Cpu className="h-7 w-7 text-blue-400" />
                            </div>
                            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Yeni Nesil</div>
                            <p className="text-slate-400 font-medium tracking-wide">Dijital Altyapı</p>
                        </motion.div>
                        <motion.div variants={fadeIn} className="space-y-3">
                            <div className="mx-auto w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                            </div>
                            <div className="text-4xl font-extrabold text-white">50.000+</div>
                            <p className="text-slate-400 font-medium tracking-wide">Yedek Parça Çeşidi</p>
                        </motion.div>
                        <motion.div variants={fadeIn} className="space-y-3">
                            <div className="mx-auto w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <Shield className="h-7 w-7 text-amber-400" />
                            </div>
                            <div className="text-4xl font-extrabold text-white">%98</div>
                            <p className="text-slate-400 font-medium tracking-wide">Müşteri Memnuniyeti</p>
                        </motion.div>
                        <motion.div variants={fadeIn} className="space-y-3">
                            <div className="mx-auto w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <Truck className="h-7 w-7 text-purple-400" />
                            </div>
                            <div className="text-4xl font-extrabold text-white">81 İle</div>
                            <p className="text-slate-400 font-medium tracking-wide">Hızlı Lojistik Ağı</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="container mx-auto px-4 max-w-6xl py-12">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="text-center mb-16 space-y-4"
                >
                    <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                        Neden Japoncu Sayman?
                    </motion.h2>
                    <motion.p variants={fadeIn} className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Geleceğin standartlarını otomotiv sektörüne getirerek parçanızı bulmayı sorun olmaktan çıkarıyoruz.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <ShieldCheck className="h-10 w-10 text-blue-600 mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Güven ve Şeffaflık</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Her ürünümüzde kalite garantisi vererek araçlarınız için en uygun standartları sağlayan orijinal ve premium Aftermarket ürünlerini sunuyoruz. Sürpriz maliyetler olmadan aradığınız parçaya ulaşırsınız.
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <Clock className="h-10 w-10 text-amber-500 mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Zaman Tasarrufu</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Akıllı stok altyapımızla doğruOEM kodunu dakikalar içinde belirliyor ve "doğru parçaya ilk seferde" ulaşmanızı sağlayarak mekanikte zaman kaybını önlüyoruz.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <Truck className="h-10 w-10 text-emerald-500 mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Hızlı Gönderim</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Sektördeki güçlü lojistik partnerlerimiz ve merkezi operasyonumuz sayesinde siparişlerinizi aynı gün kargoya teslim ediyor, aracınızın tamir sürecini hızlandırıyoruz.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="container mx-auto px-4 max-w-6xl pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="p-10 rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 shadow-sm space-y-4 hover:shadow-lg transition-shadow duration-300"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="w-8 h-1 bg-blue-600 rounded-full inline-block"></span>
                            Vizyonumuz
                        </h3>
                        <p className="text-slate-700 text-lg leading-relaxed pt-2">
                            Yedek parça sektöründe teknolojik gelişmeleri yakından takip ederek, Türkiye'nin en inovatif, en güvenilir ve en kolay ulaşılabilir Japon ve Kore yedek parça merkezi olmak; "parça bulma" işlemini tek tıklama kadar kolay hale getirmek.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="p-10 rounded-[2rem] bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 shadow-sm space-y-4 hover:shadow-lg transition-shadow duration-300"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="w-8 h-1 bg-emerald-600 rounded-full inline-block"></span>
                            Misyonumuz
                        </h3>
                        <p className="text-slate-700 text-lg leading-relaxed pt-2">
                            Araç sahiplerine ve servislere, ihtiyaç duydukları doğru parçayı sıfır hata toleransıyla, en hızlı şekilde ve şeffaf fiyat politikasıyla sunarak hem sektöre güven aşılamak hem de otomotiv ekosistemine kalıcı değer katmak.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
