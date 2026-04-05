import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "KVKK Aydınlatma Metni | Japoncu Sayman",
    description:
        "Japoncu Sayman Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni.",
};

export default function KVKKPage() {
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
                            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                        />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                    KVKK Aydınlatma Metni
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında
                    aydınlatma yükümlülüğümüz gereği bilgilendirme metnidir.
                </p>
            </div>

            {/* İçerik */}
            <div className="prose prose-slate prose-lg max-w-none space-y-10">
                {/* 1. Veri Sorumlusu */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mt-0 mb-4 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                            1
                        </span>
                        Veri Sorumlusu
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-0">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
                        uyarınca, kişisel verileriniz; veri sorumlusu olarak{" "}
                        <strong className="text-foreground">Japoncu Sayman</strong>{" "}
                        tarafından aşağıda açıklanan kapsamda işlenebilecektir. Bu
                        aydınlatma metni, KVKK&apos;nın 10. maddesi ile Aydınlatma
                        Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar
                        Hakkında Tebliğ kapsamında hazırlanmıştır.
                    </p>
                </section>

                {/* 2. Kişisel Verilerin İşlenme Amacı */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mt-0 mb-4 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                            2
                        </span>
                        Kişisel Verilerin İşlenme Amacı
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Toplanan kişisel verileriniz, KVKK&apos;nın 5. ve 6. maddelerinde
                        belirtilen kişisel veri işleme şartları dahilinde aşağıdaki
                        amaçlarla işlenebilmektedir:
                    </p>
                    <ul className="text-muted-foreground space-y-2 mt-4 mb-0">
                        <li>Ürün ve hizmetlerin sunulması, satış süreçlerinin yürütülmesi</li>
                        <li>Müşteri ilişkilerinin yönetimi ve iletişim faaliyetlerinin sürdürülmesi</li>
                        <li>Sipariş, kargo ve teslimat süreçlerinin takibi</li>
                        <li>Talep ve şikâyetlerin değerlendirilmesi</li>
                        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                        <li>Finans ve muhasebe işlerinin yürütülmesi</li>
                        <li>İnternet sitesi ziyaretçi trafiğinin analizi ve kullanıcı deneyiminin iyileştirilmesi</li>
                        <li>Pazarlama ve kampanya faaliyetlerinin yürütülmesi (açık rıza alınması halinde)</li>
                    </ul>
                </section>

                {/* 3. İşlenen Kişisel Veriler */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mt-0 mb-4 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                            3
                        </span>
                        İşlenen Kişisel Veriler
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Aşağıdaki kişisel veri kategorileri işlenebilmektedir:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {[
                            {
                                title: "Kimlik Bilgileri",
                                desc: "Ad, soyad, T.C. kimlik numarası (fatura gerekliliği halinde)",
                            },
                            {
                                title: "İletişim Bilgileri",
                                desc: "Telefon numarası, e-posta adresi, adres",
                            },
                            {
                                title: "Müşteri İşlem Bilgileri",
                                desc: "Sipariş detayları, fatura bilgileri, talep ve şikâyet kayıtları",
                            },
                            {
                                title: "İşlem Güvenliği",
                                desc: "IP adresi, çerez bilgileri, tarayıcı bilgileri",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700"
                            >
                                <h4 className="font-semibold text-foreground text-sm mb-1 mt-0">
                                    {item.title}
                                </h4>
                                <p className="text-muted-foreground text-sm mb-0 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Kişisel Verilerin Aktarılması */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mt-0 mb-4 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                            4
                        </span>
                        Kişisel Verilerin Aktarılması
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Toplanan kişisel verileriniz, KVKK&apos;nın 8. ve 9. maddelerinde
                        belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde
                        aşağıdaki taraflara aktarılabilecektir:
                    </p>
                    <ul className="text-muted-foreground space-y-2 mt-4 mb-0">
                        <li>Kargo ve lojistik firmalarına (teslimat süreçlerinin yürütülmesi amacıyla)</li>
                        <li>Muhasebe ve mali müşavirlik hizmeti veren iş ortaklarına</li>
                        <li>Yasal zorunluluk hallerinde yetkili kamu kurum ve kuruluşlarına</li>
                        <li>Ödeme ve tahsilat süreçlerinin yürütülmesi amacıyla bankalara ve ödeme kuruluşlarına</li>
                    </ul>
                </section>

                {/* 5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mt-0 mb-4 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                            5
                        </span>
                        Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Kişisel verileriniz; internet sitemiz, WhatsApp, telefon, e-posta
                        ve yüz yüze iletişim kanalları aracılığıyla elektronik veya fiziki
                        ortamda toplanmaktadır. Toplanan kişisel veriler KVKK&apos;nın 5.
                        maddesinde belirtilen aşağıdaki hukuki sebeplere dayanılarak
                        işlenmektedir:
                    </p>
                    <ul className="text-muted-foreground space-y-2 mt-4 mb-0">
                        <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması</li>
                        <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi</li>
                        <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri</li>
                        <li>İlgili kişinin açık rızasının bulunması (pazarlama faaliyetleri için)</li>
                    </ul>
                </section>

                {/* 6. Kişisel Veri Sahibinin Hakları */}
                <section className="bg-card border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mt-0 mb-4 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                            6
                        </span>
                        Kişisel Veri Sahibinin Hakları
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        KVKK&apos;nın 11. maddesi uyarınca kişisel veri sahibi olarak
                        aşağıdaki haklara sahipsiniz:
                    </p>
                    <ul className="text-muted-foreground space-y-2 mt-4">
                        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                        <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                        <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                        <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                        <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                        <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                        <li>Düzeltme, silme veya yok etme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                        <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğranması hâlinde zararın giderilmesini talep etme</li>
                    </ul>
                </section>

                {/* 7. Başvuru Yöntemi */}
                <section className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mt-0 mb-4 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                            7
                        </span>
                        Başvuru Yöntemi
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Yukarıda sıralanan haklarınıza yönelik başvurularınızı, kimliğinizi
                        tespit edici gerekli bilgiler ile KVKK&apos;nın 11. maddesinde
                        belirtilen haklardan kullanmayı talep ettiğiniz hakkınıza yönelik
                        açıklamalarınızı içeren dilekçeniz ile aşağıdaki yöntemlerden
                        birini kullanarak tarafımıza iletebilirsiniz:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border">
                            <div className="flex items-center gap-3 mb-2">
                                <svg
                                    className="w-5 h-5 text-primary shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                    />
                                </svg>
                                <h4 className="font-semibold text-foreground text-sm mt-0 mb-0">
                                    E-posta ile
                                </h4>
                            </div>
                            <p className="text-muted-foreground text-sm mb-0">
                                Güvenli elektronik imza ile imzalanmış dilekçenizi{" "}
                                <a
                                    href="mailto:info@japoncusayman.com"
                                    className="text-primary hover:underline font-medium"
                                >
                                    info@japoncusayman.com
                                </a>{" "}
                                adresine gönderebilirsiniz.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border">
                            <div className="flex items-center gap-3 mb-2">
                                <svg
                                    className="w-5 h-5 text-primary shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                    />
                                </svg>
                                <h4 className="font-semibold text-foreground text-sm mt-0 mb-0">
                                    Elden / Posta ile
                                </h4>
                            </div>
                            <p className="text-muted-foreground text-sm mb-0">
                                Islak imzalı dilekçenizi şirket adresimize bizzat veya noter
                                aracılığıyla iletebilirsiniz.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Son Not */}
                <section className="text-center py-6">
                    <p className="text-sm text-muted-foreground">
                        İşbu aydınlatma metni, 6698 Sayılı Kişisel Verilerin Korunması
                        Kanunu kapsamında hazırlanmış olup gerektiğinde güncellenebilir.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Son güncelleme: <strong>Nisan 2025</strong>
                    </p>
                </section>
            </div>
        </div>
    );
}
