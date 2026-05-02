"use client";

import { useState } from "react";
import Barcode from "react-barcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";

export default function BarcodePage() {
    const [formData, setFormData] = useState({
        mainCode: "SV05",
        brand: "Japoncu Sayman",
        oemCode1: "HYN01EA4251",
        oemCode2: "RFR-OEM 367102A200",
        phone: "0541 579 72 41",
        productName: "KIZDIRMA BUJİSİ",
        compatibility: "(ACCENT ERA BLU E)(GETZ 06-11)(I20)(I30)",
        engineDetails: "1.5-1.6-2.0 CRDI",
        barcodeValue: "367102A200"
    });

    const handlePrint = () => {
        const printContents = document.getElementById('printable-label')?.outerHTML;
        if (!printContents) return;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document;
        if (!iframeDoc) return;

        // Tailwind ve uygulamanın tüm stillerini iframe içine aktar
        const styleNodes = document.querySelectorAll('style, link[rel="stylesheet"]');
        let stylesHTML = '';
        styleNodes.forEach(node => {
            stylesHTML += node.outerHTML;
        });

        iframeDoc.open();
        iframeDoc.write(`
            <html>
                <head>
                    <title>Etiket Yazdır</title>
                    ${stylesHTML}
                    <style>
                        /* 80mm termal rulolar için standart ayarlar */
                        @page { size: 72mm auto; margin: 0; }
                        body { 
                            margin: 0; 
                            padding: 0; 
                            width: 72mm; 
                            background: white; 
                            color: black;
                        }
                        #printable-label { 
                            position: static !important; 
                            width: 72mm !important; 
                            height: auto !important; 
                            min-height: 50mm !important;
                            margin: 0 !important; 
                            border: none !important; 
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            padding: 2mm !important;
                        }
                        /* Termal yazıcılarda daha net çıkması için renkleri sabitle */
                        #printable-label, #printable-label * {
                            color: black !important;
                            border-color: black !important;
                        }
                    </style>
                </head>
                <body>
                    ${printContents}
                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.focus();
                                window.print();
                            }, 250);
                        };
                    </script>
                </body>
            </html>
        `);
        iframeDoc.close();

        // Temizleme işlemi
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        }, 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Barkod ve Etiket Üretici</h1>
                    <p className="text-sm text-slate-500 mt-1">Yedek parça raf etiketlerinizi tasarlayın ve doğrudan termal yazıcıya gönderin.</p>
                </div>
                <Button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Printer className="h-4 w-4" />
                    Yazdır
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
                {/* Sol Taraf: Düzenleme Formu (Yazıcıda gizlenir) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:hidden space-y-4">
                    <h3 className="font-semibold text-slate-900 mb-4 border-b pb-2">Etiket İçeriği</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ana/Kısa Kod (Büyük)</Label>
                            <Input name="mainCode" value={formData.mainCode} onChange={handleChange} placeholder="Örn: SV05" />
                        </div>
                        <div className="space-y-2">
                            <Label>Marka / Tedarikçi</Label>
                            <Input name="brand" value={formData.brand} onChange={handleChange} placeholder="Örn: Abs otomotiv" />
                        </div>
                        <div className="space-y-2">
                            <Label>Sağ Üst Kod</Label>
                            <Input name="oemCode1" value={formData.oemCode1} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>İletişim (Telefon)</Label>
                            <Input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Ürün Adı</Label>
                            <Input name="productName" value={formData.productName} onChange={handleChange} />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Uyumlu Araçlar</Label>
                            <Input name="compatibility" value={formData.compatibility} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Sol Alt Kod</Label>
                            <Input name="oemCode2" value={formData.oemCode2} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Ek Bilgi / Motor Tipi</Label>
                            <Input name="engineDetails" value={formData.engineDetails} onChange={handleChange} />
                        </div>
                        <div className="col-span-2 space-y-2 pt-4 border-t">
                            <Label>Barkod Değeri (Code 128)</Label>
                            <Input name="barcodeValue" value={formData.barcodeValue} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Sağ Taraf: Canlı Önizleme & Yazdırılacak Alan */}
                <div className="flex justify-center items-start print:block print:w-full print:m-0 print:p-0">
                    <div 
                        id="printable-label"
                        className="bg-white p-2 border-2 border-slate-300 print:border-none print:shadow-none shadow-sm rounded-xl print:rounded-none w-[72mm] min-h-[50mm] relative flex flex-col overflow-hidden text-black"
                    >
                        {/* Üst Kısım */}
                        <div className="flex justify-between items-start mb-1 border-b border-black pb-1">
                            <div className="text-3xl font-black tracking-tighter leading-none">{formData.mainCode}</div>
                            <div className="text-right flex flex-col justify-start">
                                <div className="font-extrabold italic text-lg tracking-tight leading-none uppercase">{formData.brand}</div>
                                <div className="font-bold text-xs tracking-wide mt-1">{formData.oemCode1}</div>
                                <div className="text-[9px] font-bold mt-0.5">{formData.phone}</div>
                            </div>
                        </div>

                        {/* Orta Kısım: Ürün Adı ve Uyumluluk */}
                        <div className="mb-2">
                            <div className="text-xs font-bold uppercase leading-tight">{formData.productName}</div>
                            <div className="text-[10px] leading-tight font-medium mt-0.5">{formData.compatibility}</div>
                        </div>

                        {/* Alt Kısım: Ekstra Bilgi ve Barkod */}
                        <div className="mt-auto border-t border-black pt-1">
                            <div className="flex justify-between items-end">
                                <div className="w-[45%]">
                                    <div className="text-[9px] font-semibold mb-1">{formData.oemCode2}</div>
                                    <div className="font-bold text-[11px]">{formData.engineDetails}</div>
                                </div>
                                <div className="w-[55%] flex justify-end">
                                    <div className="scale-[0.85] origin-bottom-right">
                                        <Barcode 
                                            value={formData.barcodeValue || "000000"} 
                                            format="CODE128" 
                                            width={1.5} 
                                            height={40} 
                                            displayValue={true} 
                                            fontSize={12}
                                            background="transparent"
                                            margin={0} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

        </div>
    );
}
