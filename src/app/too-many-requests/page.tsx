"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function TooManyRequestsPage() {
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center animate-pulse">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Çok Fazla İstek
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Sistem güvenliği geçici olarak devreye girdi. Çok kısa süre içerisinde limitlerin üzerinde işlem yaptığınız için IP adresiniz 1 dakika boyunca kısıtlandı.
                    </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-100">
                    <RefreshCcw className={`w-6 h-6 text-slate-400 mb-2 ${countdown > 0 ? "animate-spin" : ""}`} />
                    <p className="text-slate-700 font-medium font-mono text-xl">
                        {countdown > 0 ? `${countdown}s` : "Hazır!"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">kalan bekleme süresi</p>
                </div>

                {countdown === 0 ? (
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                        <Link href="/">
                            Ana Sayfaya Dön
                        </Link>
                    </Button>
                ) : (
                    <Button disabled variant="outline" className="w-full" size="lg">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Lütfen Bekleyin...
                    </Button>
                )}
                
                <p className="text-xs text-slate-400">
                    Hata kodu: HTTP 429 - Too Many Requests
                </p>
            </div>
        </div>
    );
}
