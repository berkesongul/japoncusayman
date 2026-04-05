"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const faqCategories = [
    {
        title: "Sipariş & Satın Alma",
        icon: "🛒",
        items: [
            {
                question: "Nasıl sipariş verebilirim?",
                answer:
                    "Sitemizde aradığınız ürünü bulduktan sonra ürün sayfasındaki \"WhatsApp ile Sor\" butonuna tıklayarak veya İletişim sayfamızdaki bilgiler aracılığıyla bizimle iletişime geçebilirsiniz. Siparişinizi telefon, WhatsApp veya e-posta yoluyla oluşturabilirsiniz.",
            },
            {
                question: "Kredi kartı veya havale ile ödeme yapabilir miyim?",
                answer:
                    "Evet, havale/EFT yoluyla ödeme kabul etmekteyiz. Kredi kartı ile ödeme imkanı için lütfen bizimle iletişime geçin. Ödeme detayları sipariş onayı sırasında tarafınıza iletilecektir.",
            },
            {
                question: "Minimum sipariş tutarı var mı?",
                answer:
                    "Minimum sipariş tutarımız bulunmamaktadır. Tek parça dahi sipariş verebilirsiniz. Ancak toplu alımlarda özel fiyat avantajlarından yararlanabilirsiniz.",
            },
            {
                question: "Fiyat teklifi alabilir miyim?",
                answer:
                    "Elbette! Toplu alımlar veya özel parça talepleri için WhatsApp ya da e-posta üzerinden fiyat teklifi isteyebilirsiniz. En kısa sürede size dönüş yapılacaktır.",
            },
        ],
    },
    {
        title: "Kargo & Teslimat",
        icon: "🚚",
        items: [
            {
                question: "Kargo süresi ne kadar?",
                answer:
                    "Stokta bulunan ürünler aynı gün veya en geç ertesi iş günü kargoya teslim edilir. Teslimat süresi bulunduğunuz bölgeye göre 1-3 iş günü arasındadır. İstanbul içi siparişler genellikle ertesi gün teslim edilmektedir.",
            },
            {
                question: "Hangi kargo firması ile gönderim yapılıyor?",
                answer:
                    "Anlaşmalı kargo firmalarımız aracılığıyla Türkiye'nin 81 iline gönderim yapmaktayız. Kargo firması tercihiniz varsa sipariş sırasında belirtebilirsiniz.",
            },
            {
                question: "Kargo ücreti ne kadar?",
                answer:
                    "Kargo ücreti, ürünün ağırlığına ve gönderim bölgesine göre değişmektedir. Belirli tutarın üzerindeki siparişlerde ücretsiz kargo kampanyamız bulunmaktadır. Detaylar için bizimle iletişime geçebilirsiniz.",
            },
            {
                question: "Siparişimi nasıl takip edebilirim?",
                answer:
                    "Siparişiniz kargoya verildiğinde, size kargo takip numarası WhatsApp veya SMS ile iletilir. Bu numara ile anlaşmalı kargo firmasının web sitesinden gönderinizi anlık takip edebilirsiniz.",
            },
        ],
    },
    {
        title: "Ürünler & Garanti",
        icon: "🔧",
        items: [
            {
                question: "Ürünleriniz orijinal mi?",
                answer:
                    "Evet, stoklarımızda orijinal (OEM) ve kalite testlerinden geçmiş premium aftermarket ürünler bulunmaktadır. Her ürünün orijinallik durumu ürün sayfasında ve üretici bilgisinde açıkça belirtilmektedir.",
            },
            {
                question: "Ürünlerde garanti var mı?",
                answer:
                    "Satılan tüm ürünlerimiz yasal garanti kapsamındadır. Orijinal ürünlerde üretici garantisi, aftermarket ürünlerde ise satıcı garantisi geçerlidir. Garanti süreleri ürüne göre değişiklik gösterebilir.",
            },
            {
                question: "Aracıma uygun parçayı nasıl bulurum?",
                answer:
                    "Sitemizin arama bölümünden parça adı, OEM kodu veya araç markası ile arama yapabilirsiniz. Emin olamadığınız durumlarda aracınızın ruhsat bilgilerini (marka, model, yıl, motor tipi) WhatsApp üzerinden gönderin, uzman ekibimiz size en doğru parçayı belirlesin.",
            },
            {
                question: "OEM kodu nedir ve neden önemlidir?",
                answer:
                    "OEM (Original Equipment Manufacturer) kodu, araç üreticisinin her bir parçaya verdiği benzersiz referans numarasıdır. Bu kod sayesinde aracınıza tam uyumlu parçayı hiç hata payı bırakmadan bulabilirsiniz. Parça üzerinde veya araç servis kitapçığında bu kodu görebilirsiniz.",
            },
        ],
    },
    {
        title: "İade & Değişim",
        icon: "🔄",
        items: [
            {
                question: "İade veya değişim yapabilir miyim?",
                answer:
                    "Ürünü teslim aldıktan sonra 14 gün içinde, kullanılmamış ve orijinal ambalajında olması kaydıyla iade veya değişim talep edebilirsiniz. İade sürecini başlatmak için bizimle iletişime geçmeniz yeterlidir.",
            },
            {
                question: "Yanlış parça gönderilirse ne yapmalıyım?",
                answer:
                    "Tarafımızdan kaynaklanan hatalı gönderimlerde kargo masrafı firmamıza aittir. Ürünü teslim aldığınızda mutlaka kontrol edin ve herhangi bir uyumsuzluk durumunda derhal 24 saat içinde bize bildirin. En kısa sürede doğru ürünü gönderelim.",
            },
            {
                question: "İade durumunda ücret iadesi nasıl yapılır?",
                answer:
                    "İade onaylandıktan ve ürün tarafımıza ulaştıktan sonra, ödemeniz en geç 5 iş günü içinde aynı yöntemle (havale/EFT) iade edilir.",
            },
        ],
    },
    {
        title: "Genel",
        icon: "ℹ️",
        items: [
            {
                question: "Çalışma saatleriniz nedir?",
                answer:
                    "Pazartesi – Cumartesi: 08:00 – 19:00 arası hizmet vermekteyiz. Pazar günleri kapalıyız. Ancak WhatsApp üzerinden 7/24 mesaj bırakabilirsiniz, ilk iş günü size dönüş yapılacaktır.",
            },
            {
                question: "Sadece Japon araçlara mı hizmet veriyorsunuz?",
                answer:
                    "Öncelikli uzmanlık alanımız Japon ve Kore menşeli araçlar (Toyota, Honda, Nissan, Mitsubishi, Suzuki, Hyundai, Kia vb.) olmakla birlikte, diğer tüm araç markalarına da yedek parça tedarik edebilmekteyiz.",
            },
            {
                question: "Toplu alımda indirim uyguluyor musunuz?",
                answer:
                    "Evet, oto servisler, bayiler ve toplu alım yapan müşterilerimize özel fiyatlandırma uygulamaktayız. Detaylar için lütfen bizimle iletişime geçin.",
            },
        ],
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border rounded-2xl overflow-hidden bg-card hover:shadow-md transition-shadow duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-5 sm:p-6 text-left gap-4 cursor-pointer"
            >
                <span className="font-semibold text-foreground text-[15px] sm:text-base leading-snug">
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0"
                >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                            <div className="border-t pt-4">
                                <p className="text-muted-foreground text-sm sm:text-[15px] leading-relaxed">
                                    {answer}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SSSPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            {/* Başlık */}
            <div className="text-center mb-14">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                    <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                        />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                    Sıkça Sorulan Sorular
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Merak ettiğiniz konularda en çok sorulan soruları ve cevaplarını
                    aşağıda bulabilirsiniz.
                </p>
            </div>

            {/* Kategoriler */}
            <div className="space-y-12">
                {faqCategories.map((category) => (
                    <section key={category.title}>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-2xl">{category.icon}</span>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">
                                {category.title}
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {category.items.map((item) => (
                                <FAQItem
                                    key={item.question}
                                    question={item.question}
                                    answer={item.answer}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Alt CTA */}
            <div className="mt-16 text-center bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-10">
                <h3 className="text-xl font-bold mb-2">
                    Sorunuzun cevabını bulamadınız mı?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Aklınıza takılan her konuda bize ulaşmaktan çekinmeyin. Size
                    yardımcı olmaktan mutluluk duyarız.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/iletisim"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 transition-colors"
                    >
                        İletişime Geçin
                    </Link>
                    <a
                        href="https://wa.me/905XXXXXXXXX?text=Merhaba%2C%20bir%20sorum%20var."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 transition-colors"
                    >
                        WhatsApp ile Yazın
                    </a>
                </div>
            </div>
        </div>
    );
}
