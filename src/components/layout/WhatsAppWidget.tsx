"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppWidget() {
    const [whatsappNumber, setWhatsappNumber] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                if (res.ok) {
                    const data = await res.json();
                    if (data?.whatsapp) {
                        setWhatsappNumber(data.whatsapp);
                    }
                }
            } catch (error) {
                console.error("Error fetching WhatsApp setting:", error);
            }
        };

        fetchSettings();
    }, []);

    if (!whatsappNumber) return null;

    const handleClick = () => {
        const url = `https://wa.me/${whatsappNumber.replace(/\+/g, "").replace(/\s+/g, "")}?text=Merhaba%2C%20bilgi%20almak%20istiyorum.`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#20ba59] active:scale-95"
            aria-label="WhatsApp ile iletişime geçin"
        >
            <MessageCircle className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
            </span>
        </button>
    );
}
