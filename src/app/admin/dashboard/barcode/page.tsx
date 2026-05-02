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
        phone: "TEL : 0232 461 6546",
        productName: "KIZDIRMA BUJİSİ",
        compatibility: "(ACCENT ERA BLU E)(GETZ 06-11)(I20)(I30)",
        engineDetails: "1.5-1.6-2.0 CRDI",
        barcodeValue: "367102A200"
    });

    const handlePrint = () => {
        window.print();
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
                        className="bg-white p-3 border-2 border-slate-300 print:border-none print:shadow-none shadow-sm rounded-xl print:rounded-none w-[100mm] h-[50mm] relative flex flex-col justify-between overflow-hidden text-black"
                    >
                        {/* Üst Kısım */}
                        <div className="flex justify-between items-start">
                            <div className="text-[32px] font-black tracking-tighter leading-none pt-1">{formData.mainCode}</div>
                            <div className="text-center flex flex-col items-center flex-1">
                                <div className="font-extrabold italic text-2xl tracking-tight leading-none mt-1 uppercase">{formData.brand}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-sm tracking-wide">{formData.oemCode1}</div>
                                <div className="text-[10px] font-bold mt-2">{formData.phone}</div>
                            </div>
                        </div>

                        {/* Orta Kısım: Ürün Adı ve Uyumluluk */}
                        <div className="my-2 flex-1">
                            <div className="text-[13px] font-bold uppercase leading-tight">{formData.productName} {formData.compatibility}</div>
                        </div>

                        {/* Alt Kısım: Barkod ve Ekstra Bilgi */}
                        <div className="flex justify-between items-end mt-auto">
                            <div className="w-[45%]">
                                <div className="text-[11px] font-semibold mb-2">{formData.oemCode2}</div>
                                <div className="font-bold text-[13px]">{formData.engineDetails}</div>
                            </div>
                            <div className="w-[55%] flex justify-end">
                                <div className="scale-[0.80] origin-bottom-right">
                                    <Barcode 
                                        value={formData.barcodeValue || "000000"} 
                                        format="CODE128" 
                                        width={1.6} 
                                        height={45} 
                                        displayValue={true} 
                                        fontSize={14}
                                        background="transparent"
                                        margin={0} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Yazdırma modunda sayfadaki diğer her şeyi gizleyip sadece etiketi basan CSS */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: 100mm 50mm;
                        margin: 0;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #printable-label, #printable-label * {
                        visibility: visible;
                    }
                    #printable-label {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100mm;
                        height: 50mm;
                        padding: 3mm;
                        margin: 0;
                        border: none;
                    }
                }
            `}</style>
        </div>
    );
}
